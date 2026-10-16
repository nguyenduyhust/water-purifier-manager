import FirebaseFirestore
import Foundation

/// A document in `activityLogs`, shared with the web app's history page.
struct ActivityLog: Identifiable, Decodable, Hashable {
    enum Kind: String, Decodable {
        case purifierCreated = "purifier_created"
        case purifierUpdated = "purifier_updated"
        case purifierDeleted = "purifier_deleted"
        case filterReplaced = "filter_replaced"
        case unknown

        // Newer clients may log types this build doesn't know yet.
        init(from decoder: Decoder) throws {
            let raw = try decoder.singleValueContainer().decode(String.self)
            self = Kind(rawValue: raw) ?? .unknown
        }
    }

    @DocumentID var id: String?
    var type: Kind
    var timestamp: Date
    var purifierId: String
    var purifierName: String
    var filterId: String?
    var filterName: String?
    var filterPosition: Int?
    var notes: String?
}
