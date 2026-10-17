import Foundation

/// Pages of the web app that the iOS app links to.
enum AppLinks {
    static var webApp: URL {
        let configured = Bundle.main.object(forInfoDictionaryKey: "WebAppURL") as? String
        return configured.flatMap(URL.init(string:)) ?? URL(string: "https://water-purifier-manager.vercel.app")!
    }

    static var privacyPolicy: URL { webApp.appending(path: "privacy") }
    static var support: URL { webApp.appending(path: "support") }
}
