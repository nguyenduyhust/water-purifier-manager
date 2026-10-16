import FirebaseFirestore
import Foundation

/// A document in `purifiers`. Field names match the web app's Firestore schema.
struct Purifier: Identifiable, Codable, Hashable {
    @DocumentID var id: String?
    var userId: String
    var typeId: String
    var typeName: String?
    var name: String
    var location: String?
    var installationDate: Date
    var notes: String?
    var createdAt: Date?
    var updatedAt: Date?

    /// Prefers the bundled catalog so the type name follows the current language.
    var displayTypeName: String {
        PurifierTypeCatalog.shared.type(id: typeId)?.name.resolved() ?? typeName ?? typeId
    }
}

/// A document in `purifiers/{id}/filters`.
struct Filter: Identifiable, Codable, Hashable {
    @DocumentID var id: String?
    var purifierId: String
    var userId: String
    var position: Int
    var name: String
    var intervalMonths: Int
    var lastReplacedAt: Date
    var createdAt: Date?
    var updatedAt: Date?

    func schedule(now: Date = .now) -> FilterSchedule {
        FilterStatusCalculator.schedule(lastReplacedAt: lastReplacedAt, intervalMonths: intervalMonths, now: now)
    }
}

/// A filter together with its purifier and computed status, ready for display.
struct FilterItem: Identifiable, Hashable {
    let filter: Filter
    let purifier: Purifier
    let schedule: FilterSchedule

    var id: String { filter.id ?? "\(filter.purifierId)-\(filter.position)" }
}
