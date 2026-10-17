import SwiftUI

struct PurifierListView: View {
    @Environment(PurifierStore.self) private var store
    @State private var isAddingPurifier = false
    @State private var isJoining = false

    var body: some View {
        List {
            if store.purifiers.isEmpty && !store.isLoading {
                ContentUnavailableView {
                    Label("No purifiers yet", systemImage: "drop")
                } description: {
                    Text("Add your first purifier to start tracking filter replacements.")
                } actions: {
                    Button("Add purifier") { isAddingPurifier = true }
                        .buttonStyle(.borderedProminent)
                }
                .listRowBackground(Color.clear)
            }

            ForEach(store.purifiers) { purifier in
                if let id = purifier.id {
                    NavigationLink(value: PurifierRoute(id: id)) {
                        PurifierRow(purifier: purifier, role: store.role(for: purifier), items: store.filterItems(for: id))
                    }
                }
            }
        }
        .navigationTitle("Purifiers")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button {
                        isAddingPurifier = true
                    } label: {
                        Label("Add purifier", systemImage: "plus")
                    }
                    Button {
                        isJoining = true
                    } label: {
                        Label("Join with invite link", systemImage: "person.badge.plus")
                    }
                } label: {
                    Label("Add purifier", systemImage: "plus")
                }
            }
        }
        .overlay {
            if store.isLoading { ProgressView() }
        }
        .purifierDestination()
        .sheet(isPresented: $isAddingPurifier) {
            NavigationStack { PurifierFormView(mode: .create) }
        }
        .sheet(isPresented: $isJoining) {
            NavigationStack { JoinInviteView() }
        }
    }
}

private struct PurifierRow: View {
    let purifier: Purifier
    let role: AccessRole?
    let items: [FilterItem]

    /// Items are sorted by urgency, so the first one is the worst.
    private var worstStatus: FilterStatus? { items.first?.schedule.status }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline) {
                Text(purifier.name)
                    .font(.headline)
                Spacer()
                if let worstStatus {
                    FilterStatusBadge(status: worstStatus)
                }
            }
            Text(purifier.displayTypeName)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            if case .member(let memberRole) = role {
                SharedBadge(role: memberRole)
            }
            if let location = purifier.location, !location.isEmpty {
                Label(location, systemImage: "mappin.and.ellipse")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }
}
