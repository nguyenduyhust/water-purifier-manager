import SwiftUI

struct PurifierDetailView: View {
    let purifierId: String

    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var isEditing = false
    @State private var isSharing = false
    @State private var isConfirmingDelete = false
    @State private var isConfirmingLeave = false
    @State private var isLeavingOrDeleting = false
    @State private var replacingItem: FilterItem?
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if let purifier = store.purifier(id: purifierId), let role = store.role(for: purifier) {
                content(for: purifier, role: role)
            } else if !isLeavingOrDeleting {
                ContentUnavailableView(
                    "Purifier not found",
                    systemImage: "questionmark.circle",
                    description: Text("The purifier you're looking for doesn't exist.")
                )
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .errorAlert($errorMessage)
    }

    private func content(for purifier: Purifier, role: AccessRole) -> some View {
        List {
            Section("Details") {
                if case .member(let memberRole) = role {
                    LabeledContent("Shared by") {
                        Text(purifier.ownerName ?? String(localized: "Owner"))
                    }
                    LabeledContent("Your role") {
                        Text(memberRole.title)
                    }
                }
                LabeledContent("Type", value: purifier.displayTypeName)
                if let location = purifier.location, !location.isEmpty {
                    LabeledContent("Location", value: location)
                }
                LabeledContent("Installation date") {
                    Text(purifier.installationDate, format: .dateTime.day().month().year())
                }
                if let notes = purifier.notes, !notes.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Notes").foregroundStyle(.secondary)
                        Text(notes)
                    }
                }
            }

            Section {
                ForEach(store.filterItems(for: purifierId)) { item in
                    FilterRow(item: item, onReplace: role.canEdit ? { replacingItem = item } : nil)
                }
            } header: {
                Text("Filters")
            } footer: {
                if !role.canEdit {
                    Text("You have view-only access to this purifier.")
                }
            }
        }
        .navigationTitle(purifier.name)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    if role == .owner {
                        Button {
                            isSharing = true
                        } label: {
                            let count = purifier.memberIds?.count ?? 0
                            Label(count > 0 ? "Share (\(count))" : "Share", systemImage: "person.badge.plus")
                        }
                    }
                    if role.canEdit {
                        Button {
                            isEditing = true
                        } label: {
                            Label("Edit", systemImage: "pencil")
                        }
                    }
                    if role == .owner {
                        Button(role: .destructive) {
                            isConfirmingDelete = true
                        } label: {
                            Label("Delete purifier", systemImage: "trash")
                        }
                    } else {
                        Button(role: .destructive) {
                            isConfirmingLeave = true
                        } label: {
                            Label("Leave", systemImage: "rectangle.portrait.and.arrow.right")
                        }
                    }
                } label: {
                    Label("More", systemImage: "ellipsis.circle")
                }
            }
        }
        .sheet(isPresented: $isEditing) {
            NavigationStack { PurifierFormView(mode: .edit(purifier)) }
        }
        .sheet(isPresented: $isSharing) {
            NavigationStack { ShareView(purifierId: purifierId) }
        }
        .sheet(item: $replacingItem) { item in
            NavigationStack { ReplaceFilterSheet(item: item) }
        }
        .confirmationDialog(
            "Delete purifier",
            isPresented: $isConfirmingDelete,
            titleVisibility: .visible
        ) {
            Button("Delete", role: .destructive) {
                finish { try await store.delete(purifierId: purifierId) }
            }
        } message: {
            Text("Are you sure you want to delete \"\(purifier.name)\"? All of its filters will be deleted too. This can't be undone.")
        }
        .confirmationDialog(
            "Leave \"\(purifier.name)\"?",
            isPresented: $isConfirmingLeave,
            titleVisibility: .visible
        ) {
            Button("Leave", role: .destructive) {
                finish { try await store.leave(purifierId: purifierId) }
            }
        } message: {
            Text("You will no longer see this purifier unless you are invited again.")
        }
    }

    /// Deleting or leaving: the purifier disappears from the store, so close the screen.
    private func finish(_ action: @escaping () async throws -> Void) {
        isLeavingOrDeleting = true
        Task {
            do {
                try await action()
                dismiss()
            } catch {
                isLeavingOrDeleting = false
                errorMessage = String(localized: "Something went wrong. Please try again.")
            }
        }
    }
}
