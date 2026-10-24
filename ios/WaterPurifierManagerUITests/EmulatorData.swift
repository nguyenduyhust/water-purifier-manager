import XCTest

/// Creates users and documents directly in the local emulators so a UI test can set up
/// its own data instead of depending on the shared seed. `Bearer owner` bypasses security rules.
struct EmulatorData {
    static let password = "secret123"

    private let project = "demo-water-purifier"
    private var firestore: String { "http://127.0.0.1:8080/v1/projects/\(project)/databases/(default)/documents" }
    private var identity: String { "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1" }

    /// A short random suffix that keeps emails and document ids unique per test run.
    static func uniqueSuffix() -> String {
        String(UUID().uuidString.prefix(8)).lowercased()
    }

    /// Creates an email/password account and returns its uid.
    func createUser(email: String, name: String) async throws -> String {
        let (data, _) = try await URLSession.shared.data(for: request(
            "\(identity)/accounts:signUp?key=demo-api-key",
            method: "POST",
            body: ["email": email, "password": Self.password, "displayName": name],
            authorized: false
        ))
        let json = try XCTUnwrap(JSONSerialization.jsonObject(with: data) as? [String: Any])
        return try XCTUnwrap(json["localId"] as? String)
    }

    /// Writes a purifier with the fields the apps write, plus optional members, and its filters.
    /// `filters` are (name, intervalMonths, daysSinceReplaced).
    func createPurifier(
        id: String,
        owner: (uid: String, name: String),
        name: String,
        members: [(uid: String, name: String, role: String)] = [],
        filters: [(String, Int, Int)] = [("Filter 1 - PP 5µm", 3, 80), ("Filter 2 - Activated Carbon", 6, 10)]
    ) async throws {
        let now = Date.now
        try await write("purifiers/\(id)", [
            "userId": string(owner.uid),
            "ownerName": string(owner.name),
            "typeId": string("kangaroo-kg102"),
            "typeName": string("Kangaroo - KG102 (5 filters)"),
            "name": string(name),
            "location": string("Kitchen"),
            "notes": string(""),
            "installationDate": timestamp(now.addingTimeInterval(-100 * 86_400)),
            "createdAt": timestamp(now),
            "updatedAt": timestamp(now),
            "memberIds": ["arrayValue": ["values": members.map { string($0.uid) }]],
            "roles": ["mapValue": ["fields": Dictionary(uniqueKeysWithValues: members.map { ($0.uid, string($0.role)) })]],
            "memberProfiles": ["mapValue": ["fields": Dictionary(uniqueKeysWithValues: members.map {
                ($0.uid, ["mapValue": ["fields": ["name": string($0.name), "email": string("\($0.name.lowercased())@example.com")]]])
            })]],
        ])
        for (index, filter) in filters.enumerated() {
            try await write("purifiers/\(id)/filters/\(id)-f\(index + 1)", [
                "purifierId": string(id),
                "userId": string(owner.uid),
                "position": ["integerValue": String(index + 1)],
                "name": string(filter.0),
                "intervalMonths": ["integerValue": String(filter.1)],
                "lastReplacedAt": timestamp(now.addingTimeInterval(-Double(filter.2) * 86_400)),
                "createdAt": timestamp(now),
                "updatedAt": timestamp(now),
            ])
        }
    }

    func write(_ path: String, _ fields: [String: Any]) async throws {
        let (data, response) = try await URLSession.shared.data(for: request(
            "\(firestore)/\(path)", method: "PATCH", body: ["fields": fields]
        ))
        let status = (response as? HTTPURLResponse)?.statusCode
        XCTAssertEqual(status, 200, "write \(path): \(String(data: data, encoding: .utf8) ?? "")")
    }

    func read(_ path: String) async throws -> Data? {
        let (data, response) = try await URLSession.shared.data(for: request("\(firestore)/\(path)"))
        return (response as? HTTPURLResponse)?.statusCode == 200 ? data : nil
    }

    func exists(_ path: String) async throws -> Bool {
        try await read(path) != nil
    }

    func accountExists(_ uid: String) async throws -> Bool {
        let (data, _) = try await URLSession.shared.data(for: request(
            "\(identity)/projects/\(project)/accounts:lookup", method: "POST", body: ["localId": [uid]]
        ))
        let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        return (json?["users"] as? [Any])?.isEmpty == false
    }

    func string(_ value: String) -> [String: Any] { ["stringValue": value] }

    func timestamp(_ date: Date) -> [String: Any] { ["timestampValue": ISO8601DateFormatter().string(from: date)] }

    private func request(_ url: String, method: String = "GET", body: Any? = nil, authorized: Bool = true) throws -> URLRequest {
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if authorized { request.setValue("Bearer owner", forHTTPHeaderField: "Authorization") }
        if let body { request.httpBody = try JSONSerialization.data(withJSONObject: body) }
        return request
    }
}
