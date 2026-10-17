import Foundation
import Testing
@testable import WaterPurifierManager

struct SharingTests {
    private let owner = AuthUser(uid: "alice", email: "alice@example.com", displayName: "Alice", isEmailVerified: true)
    private let erin = AuthUser(uid: "erin", email: "Erin@Example.com", displayName: "Erin", isEmailVerified: true)

    private func purifier(memberIds: [String]? = nil, roles: [String: String]? = nil) -> Purifier {
        Purifier(userId: "alice", typeId: "kangaroo-kg102", name: "Kitchen", installationDate: .now, memberIds: memberIds, roles: roles)
    }

    private func invite(
        email: String? = nil,
        status: Invite.Status = .pending,
        expiresAt: Date = .now.addingTimeInterval(3600)
    ) -> Invite {
        Invite(
            purifierId: "p1", purifierName: "Kitchen", role: .viewer, email: email, status: status,
            createdBy: "alice", createdByName: "Alice", createdAt: .now, expiresAt: expiresAt
        )
    }

    // MARK: Access roles

    @Test func ownerHasOwnerRole() {
        #expect(purifier().accessRole(for: "alice") == .owner)
    }

    @Test func membersGetTheirRole() {
        let shared = purifier(memberIds: ["bob", "carol"], roles: ["bob": "editor", "carol": "viewer"])
        #expect(shared.accessRole(for: "bob") == .member(.editor))
        #expect(shared.accessRole(for: "carol") == .member(.viewer))
        #expect(shared.accessRole(for: "dave") == nil)
    }

    @Test func unknownRoleGivesNoAccessInsteadOfFailing() {
        #expect(purifier(memberIds: ["bob"], roles: ["bob": "admin"]).accessRole(for: "bob") == nil)
    }

    @Test func onlyOwnersAndEditorsCanEdit() {
        #expect(AccessRole.owner.canEdit)
        #expect(AccessRole.member(.editor).canEdit)
        #expect(!AccessRole.member(.viewer).canEdit)
    }

    // MARK: Invite problems

    @Test func linkInviteIsUsableByAnyone() {
        #expect(invite().problem(for: erin) == nil)
    }

    @Test func emailInviteMatchesCaseInsensitively() {
        #expect(invite(email: "erin@example.com").problem(for: erin) == nil)
    }

    @Test func emailInviteRejectsOtherOrUnverifiedEmails() {
        let dave = AuthUser(uid: "dave", email: "dave@example.com", displayName: nil, isEmailVerified: true)
        let unverifiedErin = AuthUser(uid: "erin", email: "erin@example.com", displayName: nil, isEmailVerified: false)
        #expect(invite(email: "erin@example.com").problem(for: dave) == .wrongEmail("erin@example.com"))
        #expect(invite(email: "erin@example.com").problem(for: unverifiedErin) == .unverifiedEmail)
    }

    @Test func expiredUsedAndOwnInvitesAreRejected() {
        #expect(invite(expiresAt: .now.addingTimeInterval(-1)).problem(for: erin) == .expired)
        #expect(invite(status: .accepted).problem(for: erin) == .used)
        #expect(invite(status: .declined).problem(for: erin) == .declined)
        #expect(invite().problem(for: owner) == .ownPurifier)
    }

    // MARK: Invite links

    @Test func parsesInviteLinksAndCodes() {
        let id = "oFUlgf9o8RxWGSJGH7ZM"
        #expect(InviteLink.inviteId(from: "https://water-purifier-manager.vercel.app/invite/\(id)") == id)
        #expect(InviteLink.inviteId(from: "  https://example.com/invite/\(id)?utm=zalo \n") == id)
        #expect(InviteLink.inviteId(from: id) == id)
    }

    @Test func rejectsTextThatIsNotAnInvite() {
        #expect(InviteLink.inviteId(from: "") == nil)
        #expect(InviteLink.inviteId(from: "https://example.com/purifiers/abc") == nil)
        #expect(InviteLink.inviteId(from: "hello world") == nil)
    }

    @Test func buildsLinksToTheWebInvitePage() {
        let url = InviteLink.url(for: "abc123")
        #expect(url.path() == "/invite/abc123")
        #expect(url.scheme == "https")
    }
}
