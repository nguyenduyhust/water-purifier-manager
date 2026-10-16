import Foundation

enum AppLanguage {
    case english
    case vietnamese

    /// The language the app UI is actually running in, which respects the
    /// per-app language chosen in iOS Settings.
    static var current: AppLanguage {
        Bundle.main.preferredLocalizations.first?.hasPrefix("vi") == true ? .vietnamese : .english
    }
}

struct LocalizedText: Decodable, Hashable {
    let en: String
    let vi: String

    func resolved(for language: AppLanguage = .current) -> String {
        switch language {
        case .english: en
        case .vietnamese: vi
        }
    }
}

struct FilterTemplate: Decodable, Hashable {
    let position: Int
    let name: LocalizedText
    let defaultIntervalMonths: Int
    let description: LocalizedText
}

struct PurifierType: Decodable, Hashable, Identifiable {
    let id: String
    let name: LocalizedText
    let filterTemplates: [FilterTemplate]

    /// Names follow the "Brand - Model" convention in shared/purifier-types.json.
    var brand: String {
        name.en.components(separatedBy: " - ").first ?? name.en
    }
}

/// Purifier models bundled from `shared/purifier-types.json`, the same file the web app uses.
struct PurifierTypeCatalog {
    static let fileName = "purifier-types"

    static let shared: PurifierTypeCatalog = {
        do {
            return try load()
        } catch {
            fatalError("Bundled \(fileName).json is missing or invalid: \(error)")
        }
    }()

    let types: [PurifierType]

    static func load(from bundle: Bundle = .main) throws -> PurifierTypeCatalog {
        guard let url = bundle.url(forResource: fileName, withExtension: "json") else {
            throw CocoaError(.fileNoSuchFile)
        }
        let data = try Data(contentsOf: url)
        return PurifierTypeCatalog(types: try JSONDecoder().decode([PurifierType].self, from: data))
    }

    func type(id: String) -> PurifierType? {
        types.first { $0.id == id }
    }

    /// Types grouped by brand, keeping the order of the JSON file.
    var typesByBrand: [(brand: String, types: [PurifierType])] {
        var groups: [(brand: String, types: [PurifierType])] = []
        for type in types {
            if let index = groups.firstIndex(where: { $0.brand == type.brand }) {
                groups[index].types.append(type)
            } else {
                groups.append((type.brand, [type]))
            }
        }
        return groups
    }
}
