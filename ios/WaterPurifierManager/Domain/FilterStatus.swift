import Foundation

/// Raw values double as urgency order: most urgent first.
enum FilterStatus: Int, Comparable {
    case expired = 0
    case warning = 1
    case ok = 2

    static func < (lhs: FilterStatus, rhs: FilterStatus) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

struct FilterSchedule: Hashable {
    let nextReplacementAt: Date
    let daysUntilReplacement: Int
    let status: FilterStatus
}

/// Mirrors `web/src/services/filter-status-service.ts` so the web and iOS apps
/// always agree on a filter's status.
enum FilterStatusCalculator {
    static let warningThresholdDays = 30

    static func schedule(
        lastReplacedAt: Date,
        intervalMonths: Int,
        now: Date = .now,
        calendar: Calendar = .current
    ) -> FilterSchedule {
        // Like date-fns addMonths, this clamps to the last day of shorter months.
        let next = calendar.date(byAdding: .month, value: intervalMonths, to: lastReplacedAt) ?? lastReplacedAt
        // Like date-fns differenceInDays, this counts whole days only.
        let days = calendar.dateComponents([.day], from: now, to: next).day ?? 0

        let status: FilterStatus
        if days <= 0 {
            status = .expired
        } else if days <= warningThresholdDays {
            status = .warning
        } else {
            status = .ok
        }

        return FilterSchedule(nextReplacementAt: next, daysUntilReplacement: days, status: status)
    }

    static func sortedByUrgency<Item>(_ items: [Item], schedule: (Item) -> FilterSchedule) -> [Item] {
        items.sorted {
            let lhs = schedule($0)
            let rhs = schedule($1)
            return (lhs.status, lhs.daysUntilReplacement) < (rhs.status, rhs.daysUntilReplacement)
        }
    }
}
