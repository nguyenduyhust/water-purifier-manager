import SwiftUI

struct HistoryView: View {
    @Environment(HistoryStore.self) private var history
    @Environment(PurifierStore.self) private var store

    var body: some View {
        @Bindable var history = history

        List {
            if history.logs.isEmpty && history.hasLoaded {
                ContentUnavailableView {
                    Label("No history yet", systemImage: "clock")
                } description: {
                    Text("Activity will show up here when you add purifiers or replace filters.")
                }
                .listRowBackground(Color.clear)
            }

            ForEach(history.logs) { log in
                ActivityRow(log: log)
            }
        }
        .navigationTitle("History")
        .overlay {
            if history.isLoading && !history.hasLoaded { ProgressView() }
        }
        .refreshable { await history.load(purifierIds: purifierIds) }
        // Reload on every visit, and when purifiers change, so entries from other members show up.
        .task(id: purifierIds) { await history.load(purifierIds: purifierIds) }
        .errorAlert($history.errorMessage)
    }

    private var purifierIds: [String] { store.purifiers.compactMap(\.id) }
}

private struct ActivityRow: View {
    let log: ActivityLog

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: systemImage)
                .foregroundStyle(tint)
                .font(.title3)
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.body.weight(.medium))
                Text(log.purifierName)
                    .font(.subheadline)
                if let filterName = log.filterName {
                    Text(filterName)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                if let actorName = log.actorName, !actorName.isEmpty {
                    Text("by \(actorName)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                if let notes = log.notes, !notes.isEmpty {
                    Text(notes)
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .italic()
                }
                Text(log.timestamp, format: .dateTime.day().month().year())
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }

    private var title: LocalizedStringKey {
        switch log.type {
        case .purifierCreated: "Purifier added"
        case .purifierUpdated: "Purifier updated"
        case .purifierDeleted: "Purifier deleted"
        case .filterReplaced: "Filter replaced"
        case .unknown: "Activity"
        }
    }

    private var systemImage: String {
        switch log.type {
        case .purifierCreated: "plus.circle.fill"
        case .purifierUpdated: "pencil.circle.fill"
        case .purifierDeleted: "trash.circle.fill"
        case .filterReplaced: "arrow.triangle.2.circlepath.circle.fill"
        case .unknown: "circle.fill"
        }
    }

    private var tint: Color {
        switch log.type {
        case .purifierCreated: .blue
        case .filterReplaced: .green
        case .purifierDeleted: .red
        case .purifierUpdated, .unknown: .secondary
        }
    }
}
