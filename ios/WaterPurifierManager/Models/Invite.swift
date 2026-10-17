import FirebaseFirestore
import Foundation

/// A document in `invites`. The random document id is the secret in an invite link.
struct Invite: Identifiable, Decodable, Hashable {
    enum Status: String, Decodable {
        case pending
        case accepted
        case declined
    }

    /// Why the signed-in user can't accept an invite.
    enum Problem: Equatable {
        case expired
        case used
        case declined
        case wrongEmail(String)
        case unverifiedEmail
        case ownPurifier
        case alreadyMember
    }

    @DocumentID var id: String?
    var purifierId: String
    var purifierName: String
    var role: MemberRole
    var email: String?
    var status: Status
    var createdBy: String
    var createdByName: String
    var createdAt: Date
    var expiresAt: Date

    func problem(for user: AuthUser, now: Date = .now) -> Problem? {
        if createdBy == user.uid { return .ownPurifier }
        switch status {
        case .accepted: return .used
        case .declined: return .declined
        case .pending: break
        }
        if expiresAt <= now { return .expired }
        if let email {
            guard user.email?.lowercased() == email else { return .wrongEmail(email) }
            guard user.isEmailVerified else { return .unverifiedEmail }
        }
        return nil
    }
}

/// The person performing an action, recorded on history entries.
struct Actor: Equatable {
    let id: String
    let name: String
}

enum InviteLink {
    static let validity: TimeInterval = 7 * 24 * 60 * 60

    /// The web app's invite page, which also works from a phone browser.
    static func url(for inviteId: String) -> URL {
        AppLinks.webApp.appending(path: "invite/\(inviteId)")
    }

    /// Accepts a full invite link or just the code.
    static func inviteId(from text: String) -> String? {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }
        let candidate: String
        if let url = URL(string: trimmed), url.scheme != nil {
            let parts = url.pathComponents
            guard let index = parts.firstIndex(of: "invite"), index + 1 < parts.count else { return nil }
            candidate = parts[index + 1]
        } else {
            candidate = trimmed
        }
        // Firestore auto ids are 20 alphanumeric characters.
        return candidate.range(of: "^[A-Za-z0-9]{10,40}$", options: .regularExpression) != nil ? candidate : nil
    }
}
