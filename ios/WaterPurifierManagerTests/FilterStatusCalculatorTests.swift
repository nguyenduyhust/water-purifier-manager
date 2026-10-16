import Foundation
import Testing
@testable import WaterPurifierManager

struct FilterStatusCalculatorTests {
    private let calendar: Calendar = {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Asia/Ho_Chi_Minh")!
        return calendar
    }()

    private func date(_ year: Int, _ month: Int, _ day: Int, hour: Int = 12) -> Date {
        calendar.date(from: DateComponents(year: year, month: month, day: day, hour: hour))!
    }

    private func schedule(lastReplacedAt: Date, months: Int, now: Date) -> FilterSchedule {
        FilterStatusCalculator.schedule(lastReplacedAt: lastReplacedAt, intervalMonths: months, now: now, calendar: calendar)
    }

    @Test func nextReplacementAddsIntervalMonths() {
        let result = schedule(lastReplacedAt: date(2026, 1, 15), months: 6, now: date(2026, 2, 1))
        #expect(result.nextReplacementAt == date(2026, 7, 15))
    }

    @Test func clampsToEndOfShorterMonth() {
        let result = schedule(lastReplacedAt: date(2026, 1, 31), months: 1, now: date(2026, 1, 31))
        #expect(result.nextReplacementAt == date(2026, 2, 28))
    }

    @Test func okWhenMoreThanThirtyDaysLeft() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 5, 31))
        #expect(result.daysUntilReplacement == 31)
        #expect(result.status == .ok)
    }

    @Test func warningAtExactlyThirtyDaysLeft() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 6, 1))
        #expect(result.daysUntilReplacement == 30)
        #expect(result.status == .warning)
    }

    @Test func warningWithOneDayLeft() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 6, 30))
        #expect(result.daysUntilReplacement == 1)
        #expect(result.status == .warning)
    }

    @Test func expiredOnDueDate() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 7, 1))
        #expect(result.daysUntilReplacement == 0)
        #expect(result.status == .expired)
    }

    @Test func partialDayCountsAsZeroLikeDateFns() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 7, 1, hour: 0))
        #expect(result.daysUntilReplacement == 0)
        #expect(result.status == .expired)
    }

    @Test func overdueDaysAreNegative() {
        let result = schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: date(2026, 7, 4))
        #expect(result.daysUntilReplacement == -3)
        #expect(result.status == .expired)
    }

    @Test func sortsByStatusThenDaysLeft() {
        let now = date(2026, 6, 1)
        let schedules = [
            schedule(lastReplacedAt: date(2026, 1, 1), months: 12, now: now),
            schedule(lastReplacedAt: date(2026, 1, 1), months: 6, now: now),
            schedule(lastReplacedAt: date(2025, 12, 1), months: 6, now: now),
            schedule(lastReplacedAt: date(2025, 11, 1), months: 6, now: now),
            schedule(lastReplacedAt: date(2026, 1, 10), months: 5, now: now),
        ]

        let sorted = FilterStatusCalculator.sortedByUrgency(schedules) { $0 }

        #expect(sorted.map(\.status) == [.expired, .expired, .warning, .warning, .ok])
        #expect(sorted.map(\.daysUntilReplacement) == [-31, 0, 9, 30, 214])
    }
}
