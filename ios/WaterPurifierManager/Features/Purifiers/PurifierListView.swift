import SwiftUI

struct PurifierListView: View {
    @Environment(PurifierStore.self) private var store
    @State private var isAddingPurifier = false

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
                        PurifierRow(purifier: purifier, items: store.filterItems(for: id))
                    }
                }
            }
        }
        .navigationTitle("Purifiers")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    isAddingPurifier = true
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
    }
}

private struct PurifierRow: View {
    let purifier: Purifier
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
            if let location = purifier.location, !location.isEmpty {
                Label(location, systemImage: "mappin.and.ellipse")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }
}
