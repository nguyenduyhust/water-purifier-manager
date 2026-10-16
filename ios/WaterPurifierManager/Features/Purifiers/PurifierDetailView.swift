import SwiftUI

struct PurifierDetailView: View {
    let purifierId: String

    @Environment(PurifierStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var isEditing = false
    @State private var isConfirmingDelete = false
    @State private var isDeleting = false
    @State private var replacingItem: FilterItem?
    @State private var errorMessage: String?

    var body: some View {
        Group {
            if let purifier = store.purifier(id: purifierId) {
                content(for: purifier)
            } else if !isDeleting {
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

    private func content(for purifier: Purifier) -> some View {
        List {
            Section("Details") {
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

            Section("Filters") {
                ForEach(store.filterItems(for: purifierId)) { item in
                    FilterRow(item: item) { replacingItem = item }
                }
            }
        }
        .navigationTitle(purifier.name)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button {
                        isEditing = true
                    } label: {
                        Label("Edit", systemImage: "pencil")
                    }
                    Button(role: .destructive) {
                        isConfirmingDelete = true
                    } label: {
                        Label("Delete purifier", systemImage: "trash")
                    }
                } label: {
                    Label("More", systemImage: "ellipsis.circle")
                }
            }
        }
        .sheet(isPresented: $isEditing) {
            NavigationStack { PurifierFormView(mode: .edit(purifier)) }
        }
        .sheet(item: $replacingItem) { item in
            NavigationStack { ReplaceFilterSheet(item: item) }
        }
        .confirmationDialog(
            "Delete purifier",
            isPresented: $isConfirmingDelete,
            titleVisibility: .visible
        ) {
            Button("Delete", role: .destructive) { delete() }
        } message: {
            Text("Are you sure you want to delete \"\(purifier.name)\"? All of its filters will be deleted too. This can't be undone.")
        }
    }

    private func delete() {
        isDeleting = true
        Task {
            do {
                try await store.delete(purifierId: purifierId)
                dismiss()
            } catch {
                isDeleting = false
                errorMessage = String(localized: "Failed to delete purifier. Please try again.")
            }
        }
    }
}
