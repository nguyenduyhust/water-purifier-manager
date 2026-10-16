import Foundation
import UserNotifications

struct FilterReminder: Sendable {
    let filterId: String
    let filterName: String
    let purifierName: String
    let dueDate: Date
}

/// Schedules local reminders for filter replacements on the device, so no
/// backend or push service is needed.
final class NotificationScheduler: Sendable {
    static let shared = NotificationScheduler()

    static let reminderHour = 9
    static let advanceNoticeDays = 7
    /// iOS keeps at most 64 pending local notifications per app.
    private static let maxPendingRequests = 60
    private static let identifierPrefix = "filter-reminder."

    private var center: UNUserNotificationCenter { .current() }

    func authorizationStatus() async -> UNAuthorizationStatus {
        await center.notificationSettings().authorizationStatus
    }

    @discardableResult
    func requestAuthorizationIfNeeded() async -> Bool {
        switch await authorizationStatus() {
        case .notDetermined:
            return (try? await center.requestAuthorization(options: [.alert, .sound, .badge])) ?? false
        case .authorized, .provisional, .ephemeral:
            return true
        default:
            return false
        }
    }

    func reschedule(_ reminders: [FilterReminder], now: Date = .now) async {
        await removeAll()
        guard [.authorized, .provisional, .ephemeral].contains(await authorizationStatus()) else { return }

        var requests: [(fireDate: Date, request: UNNotificationRequest)] = []
        for reminder in reminders {
            let soonDate = fireDate(on: reminder.dueDate, daysBefore: Self.advanceNoticeDays)
            if let soonDate, soonDate > now {
                let content = UNMutableNotificationContent()
                content.title = String(localized: "Filter replacement coming up")
                content.body = String(localized: "\(reminder.filterName) in \(reminder.purifierName) is due in \(Self.advanceNoticeDays) days.")
                requests.append((soonDate, makeRequest(id: "\(reminder.filterId).soon", content: content, at: soonDate)))
            }

            let dueDate = fireDate(on: reminder.dueDate, daysBefore: 0)
            if let dueDate, dueDate > now {
                let content = UNMutableNotificationContent()
                content.title = String(localized: "Time to replace a filter")
                content.body = String(localized: "\(reminder.filterName) in \(reminder.purifierName) is due today.")
                content.sound = .default
                requests.append((dueDate, makeRequest(id: "\(reminder.filterId).due", content: content, at: dueDate)))
            }
        }

        let soonest = requests.sorted { $0.fireDate < $1.fireDate }.prefix(Self.maxPendingRequests)
        for item in soonest {
            try? await center.add(item.request)
        }
    }

    func removeAll() async {
        let ids = await center.pendingNotificationRequests()
            .map(\.identifier)
            .filter { $0.hasPrefix(Self.identifierPrefix) }
        center.removePendingNotificationRequests(withIdentifiers: ids)
    }

    private func fireDate(on dueDate: Date, daysBefore: Int) -> Date? {
        let calendar = Calendar.current
        guard let day = calendar.date(byAdding: .day, value: -daysBefore, to: dueDate) else { return nil }
        return calendar.date(bySettingHour: Self.reminderHour, minute: 0, second: 0, of: day)
    }

    private func makeRequest(id: String, content: UNMutableNotificationContent, at date: Date) -> UNNotificationRequest {
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        return UNNotificationRequest(identifier: Self.identifierPrefix + id, content: content, trigger: trigger)
    }
}
