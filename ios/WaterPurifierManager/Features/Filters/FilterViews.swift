import SwiftUI

extension FilterStatus {
    var title: LocalizedStringKey {
        switch self {
        case .ok: "OK"
        case .warning: "Due soon"
        case .expired: "Expired"
        }
    }

    var color: Color {
        switch self {
        case .ok: .green
        case .warning: .orange
        case .expired: .red
        }
    }

    var systemImage: String {
        switch self {
        case .ok: "checkmark.circle.fill"
        case .warning: "exclamationmark.circle.fill"
        case .expired: "xmark.octagon.fill"
        }
    }
}

extension FilterSchedule {
    var daysText: String {
        if daysUntilReplacement > 0 {
            String(localized: "\(daysUntilReplacement) days left")
        } else if daysUntilReplacement == 0 {
            String(localized: "Due today")
        } else {
            String(localized: "Overdue by \(-daysUntilReplacement) days")
        }
    }
}

enum FilterText {
    static func interval(months: Int) -> String {
        String(localized: "Every \(months) months")
    }
}

struct FilterStatusBadge: View {
    let status: FilterStatus

    var body: some View {
        Text(status.title)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .foregroundStyle(status.color)
            .background(status.color.opacity(0.15), in: Capsule())
    }
}

/// A filter on the purifier detail screen.
struct FilterRow: View {
    let item: FilterItem
    let onReplace: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .firstTextBaseline) {
                Text(item.filter.name)
                    .font(.headline)
                Spacer()
                FilterStatusBadge(status: item.schedule.status)
            }

            Text(FilterText.interval(months: item.filter.intervalMonths))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Grid(alignment: .leading, horizontalSpacing: 12, verticalSpacing: 4) {
                GridRow {
                    Text("Last replaced").foregroundStyle(.secondary)
                    Text(item.filter.lastReplacedAt, format: .dateTime.day().month().year())
                }
                GridRow {
                    Text("Next replacement").foregroundStyle(.secondary)
                    Text(item.schedule.nextReplacementAt, format: .dateTime.day().month().year())
                }
            }
            .font(.subheadline)

            HStack {
                Text(item.schedule.daysText)
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(item.schedule.status.color)
                Spacer()
                Button("Replace", action: onReplace)
                    .buttonStyle(.bordered)
                    .controlSize(.small)
            }
        }
        .padding(.vertical, 4)
    }
}

/// A filter in a cross-purifier list such as the dashboard.
struct FilterSummaryRow: View {
    let item: FilterItem

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: item.schedule.status.systemImage)
                .foregroundStyle(item.schedule.status.color)
                .font(.title3)
            VStack(alignment: .leading, spacing: 2) {
                Text(item.filter.name)
                    .font(.body.weight(.medium))
                Text(item.purifier.name)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Text(item.schedule.daysText)
                .font(.subheadline)
                .foregroundStyle(item.schedule.status.color)
                .multilineTextAlignment(.trailing)
        }
    }
}
