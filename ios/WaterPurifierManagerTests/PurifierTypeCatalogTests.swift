import Foundation
import Testing
@testable import WaterPurifierManager

/// Guards the shared JSON that both the web and iOS apps bundle.
struct PurifierTypeCatalogTests {
    private let catalog: PurifierTypeCatalog

    init() throws {
        catalog = try PurifierTypeCatalog.load()
    }

    @Test func loadsSharedCatalog() {
        #expect(!catalog.types.isEmpty)
    }

    @Test func idsAreUnique() {
        let ids = catalog.types.map(\.id)
        #expect(Set(ids).count == ids.count)
    }

    @Test func everyTextHasBothLanguages() {
        for type in catalog.types {
            #expect(!type.name.en.isEmpty && !type.name.vi.isEmpty, "\(type.id) name")
            for template in type.filterTemplates {
                #expect(!template.name.en.isEmpty && !template.name.vi.isEmpty, "\(type.id) filter \(template.position)")
                #expect(!template.description.en.isEmpty && !template.description.vi.isEmpty, "\(type.id) filter \(template.position)")
            }
        }
    }

    @Test func filterPositionsAreSequentialFromOne() {
        for type in catalog.types {
            #expect(type.filterTemplates.map(\.position) == Array(1...type.filterTemplates.count), "\(type.id)")
        }
    }

    @Test func intervalsArePositive() {
        for type in catalog.types {
            for template in type.filterTemplates {
                #expect(template.defaultIntervalMonths > 0, "\(type.id) filter \(template.position)")
            }
        }
    }

    @Test func groupsByBrandInFileOrder() {
        let brands = catalog.typesByBrand.map(\.brand)
        #expect(brands == ["Kangaroo", "Karofi", "Sunhouse", "Hòa Phát", "Toshiba", "Mutosi", "A. O. Smith"])
        #expect(catalog.typesByBrand.map(\.types.count).reduce(0, +) == catalog.types.count)
    }
}
