import SwiftUI

struct DashboardView: View {
    @Environment(PurifierStore.self) private var store
    @State private var isAddingPurifier = false

    var body: some View {
        List {
            if store.purifiers.isEmpty {
                if !store.isLoading {
                    ContentUnavailableView {
                        Label("No purifiers yet", systemImage: "drop")
                    } description: {
                        Text("Add your first purifier to start tracking filter replacements.")
                    } actions: {
                        Button("Add your first purifier") { isAddingPurifier = true }
                            .buttonStyle(.borderedProminent)
                    }
                    .listRowBackground(Color.clear)
                }
            } else {
                Section {
                    StatsGrid(stats: store.stats)
                }
                .listRowBackground(Color.clear)
                .listRowInsets(EdgeInsets())

                attentionSection
            }
        }
        .navigationTitle("Dashboard")
        .overlay {
            if store.isLoading { ProgressView() }
        }
        .purifierDestination()
        .sheet(isPresented: $isAddingPurifier) {
            NavigationStack { PurifierFormView(mode: .create) }
        }
    }

    @ViewBuilder
    private var attentionSection: some View {
        let attention = store.allFilterItems.filter { $0.schedule.status != .ok }

        Section("Filters needing attention") {
            if attention.isEmpty {
                Label("All filters are OK", systemImage: "checkmark.seal.fill")
                    .foregroundStyle(.green)
            } else {
                ForEach(attention) { item in
                    NavigationLink(value: PurifierRoute(id: item.filter.purifierId)) {
                        FilterSummaryRow(item: item)
                    }
                }
            }
        }
    }
}

private struct StatsGrid: View {
    let stats: DashboardStats

    var body: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            StatTile(title: "Purifiers", value: stats.totalPurifiers, systemImage: "drop.fill", tint: .blue)
            StatTile(title: "Filters", value: stats.totalFilters, systemImage: "line.3.horizontal.decrease.circle.fill", tint: .indigo)
            StatTile(
                title: "Needs attention",
                value: stats.expiredFilters + stats.warningFilters,
                systemImage: "exclamationmark.triangle.fill",
                tint: stats.expiredFilters > 0 ? .red : .orange
            )
            StatTile(title: "Filters OK", value: stats.okFilters, systemImage: "checkmark.circle.fill", tint: .green)
        }
    }
}

private struct StatTile: View {
    let title: LocalizedStringKey
    let value: Int
    let systemImage: String
    let tint: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: systemImage)
                .foregroundStyle(tint)
                .font(.title3)
            Text(value, format: .number)
                .font(.title.bold())
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 12))
    }
}
