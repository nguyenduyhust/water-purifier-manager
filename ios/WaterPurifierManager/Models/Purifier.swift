import FirebaseFirestore
import Foundation

enum MemberRole: String, Codable, CaseIterable, Identifiable {
    case editor
    case viewer

    var id: String { rawValue }
}

enum AccessRole: Equatable {
    case owner
    case member(MemberRole)

    var canEdit: Bool {
        switch self {
        case .owner, .member(.editor): true
        case .member(.viewer): false
        }
    }
}

struct MemberProfile: Codable, Hashable {
    var name: String
    var email: String?
    var joinedAt: Date?
}

/// A document in `purifiers`. Field names match the web app's Firestore schema.
struct Purifier: Identifiable, Codable, Hashable {
    @DocumentID var id: String?
    var userId: String  // owner
    var typeId: String
    var typeName: String?
    var name: String
    var location: String?
    var installationDate: Date
    var notes: String?
    var createdAt: Date?
    var updatedAt: Date?
    var ownerName: String?
    // Shared members, owner excluded
    var memberIds: [String]?
    // Raw strings so an unknown role from a newer client can't break decoding.
    var roles: [String: String]?
    var memberProfiles: [String: MemberProfile]?

    func accessRole(for uid: String) -> AccessRole? {
        if userId == uid { return .owner }
        guard memberIds?.contains(uid) == true, let role = roles?[uid].flatMap(MemberRole.init(rawValue:)) else { return nil }
        return .member(role)
    }

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
