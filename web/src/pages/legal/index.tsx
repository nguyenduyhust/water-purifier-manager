import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppLogo } from '@/components/app-logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import { SUPPORT_EMAIL } from '@/lib/legal';

// Public pages linked from the App Store listing, so they render without signing in.
// The text is long-form and changes rarely, so it lives here rather than in the locale files.

interface Section {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

interface LegalContent {
  title: string;
  updated: string;
  sections: Section[];
}

const PRIVACY: Record<'en' | 'vi', LegalContent> = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: October 17, 2026',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          `Water Purifier Manager (the web app and the iOS app "Water Purifier") is an independent app that helps you track filter replacements for your water purifiers. Contact: ${SUPPORT_EMAIL}.`,
        ],
      },
      {
        heading: 'What we collect',
        items: [
          'Account: your email address, your name, and the user ID created by Firebase Authentication. If you sign in with Google, your Google profile name and photo; if you sign in with Apple, the name and email Apple shares (which may be a private relay address).',
          'Purifier data you enter: purifier names, models, locations, notes, installation dates, filters and replacement history.',
          'Sharing: when you share a purifier, the names and email addresses of its members and of the people you invite. Members see the owner’s name and who made each history entry.',
        ],
        paragraphs: [
          'We do not collect location, contacts, photos, advertising identifiers or analytics, and we do not track you across apps or websites.',
        ],
      },
      {
        heading: 'How we use it',
        paragraphs: [
          'Only to run the app: to sign you in, store and sync your purifiers between your devices, show them to the people you share them with, and calculate when filters are due. Filter reminders on iOS are scheduled on your device. We do not sell your data or use it for advertising.',
        ],
      },
      {
        heading: 'Where it is stored',
        paragraphs: [
          'Data is stored with Google Firebase (Authentication and Cloud Firestore). The web app is hosted by Vercel. These providers process data on our behalf under their own privacy and security terms.',
        ],
      },
      {
        heading: 'How long we keep it, and deleting it',
        paragraphs: [
          'We keep your data until you delete it or your account. You can delete your account at any time: in the iOS app under Settings → Delete account, or on the web from the account menu. This deletes your account, the purifiers you own with their filters, history and invites, and removes you from purifiers shared with you. History entries you added to someone else’s purifier remain with your name, as part of their history. You can also ask us to delete your data by email.',
        ],
      },
      {
        heading: 'Children',
        paragraphs: ['The app is not directed at children under 13.'],
      },
      {
        heading: 'Changes',
        paragraphs: ['If this policy changes, we will update this page and the date above.'],
      },
    ],
  },
  vi: {
    title: 'Chính sách quyền riêng tư',
    updated: 'Cập nhật lần cuối: 17/10/2026',
    sections: [
      {
        heading: 'Về chúng tôi',
        paragraphs: [
          `Water Purifier Manager (ứng dụng web và ứng dụng iOS "Water Purifier") là ứng dụng độc lập giúp bạn theo dõi lịch thay lõi máy lọc nước. Liên hệ: ${SUPPORT_EMAIL}.`,
        ],
      },
      {
        heading: 'Dữ liệu chúng tôi thu thập',
        items: [
          'Tài khoản: email, tên của bạn và mã người dùng do Firebase Authentication tạo. Nếu đăng nhập bằng Google: tên và ảnh hồ sơ Google; nếu đăng nhập bằng Apple: tên và email Apple chia sẻ (có thể là địa chỉ ẩn danh).',
          'Dữ liệu máy lọc bạn nhập: tên máy, model, vị trí, ghi chú, ngày lắp đặt, lõi lọc và lịch sử thay lõi.',
          'Chia sẻ: khi bạn chia sẻ máy lọc, tên và email của các thành viên và những người bạn mời. Thành viên thấy tên chủ máy và ai đã thực hiện từng mục lịch sử.',
        ],
        paragraphs: [
          'Chúng tôi không thu thập vị trí, danh bạ, ảnh, mã quảng cáo hay dữ liệu phân tích, và không theo dõi bạn trên các ứng dụng hay trang web khác.',
        ],
      },
      {
        heading: 'Cách chúng tôi sử dụng',
        paragraphs: [
          'Chỉ để vận hành ứng dụng: đăng nhập, lưu và đồng bộ máy lọc giữa các thiết bị, hiển thị cho người bạn chia sẻ, và tính ngày cần thay lõi. Nhắc nhở thay lõi trên iOS được lên lịch ngay trên thiết bị. Chúng tôi không bán dữ liệu và không dùng cho quảng cáo.',
        ],
      },
      {
        heading: 'Nơi lưu trữ',
        paragraphs: [
          'Dữ liệu được lưu trên Google Firebase (Authentication và Cloud Firestore). Ứng dụng web được lưu trữ trên Vercel. Các nhà cung cấp này xử lý dữ liệu thay mặt chúng tôi theo điều khoản bảo mật của họ.',
        ],
      },
      {
        heading: 'Thời gian lưu và cách xóa',
        paragraphs: [
          'Dữ liệu được giữ cho đến khi bạn xóa nó hoặc xóa tài khoản. Bạn có thể xóa tài khoản bất cứ lúc nào: trong ứng dụng iOS tại Cài đặt → Xóa tài khoản, hoặc trên web từ menu tài khoản. Thao tác này xóa tài khoản, các máy lọc bạn sở hữu kèm lõi lọc, lịch sử và lời mời, đồng thời gỡ bạn khỏi các máy lọc được chia sẻ. Các mục bạn đã thêm vào lịch sử máy lọc của người khác vẫn giữ tên bạn như một phần lịch sử của họ. Bạn cũng có thể gửi email yêu cầu chúng tôi xóa dữ liệu.',
        ],
      },
      {
        heading: 'Trẻ em',
        paragraphs: ['Ứng dụng không dành cho trẻ em dưới 13 tuổi.'],
      },
      {
        heading: 'Thay đổi',
        paragraphs: ['Nếu chính sách thay đổi, chúng tôi sẽ cập nhật trang này và ngày ở trên.'],
      },
    ],
  },
};

const SUPPORT: Record<'en' | 'vi', LegalContent> = {
  en: {
    title: 'Support',
    updated: '',
    sections: [
      {
        heading: 'Contact',
        paragraphs: [`Questions, problems or a purifier model that is missing? Email ${SUPPORT_EMAIL} and we will reply as soon as we can.`],
      },
      {
        heading: 'Common questions',
        items: [
          'My model is not in the list: choose the closest model and adjust each filter’s interval after creating the purifier, then email us the model name.',
          'Reminders: on iPhone, turn them on in the app’s Settings. You are reminded a few days before and on the day each filter is due.',
          'Sharing: open a purifier and choose Share to invite people as editors (can replace filters) or viewers (read only).',
          'Deleting your account: in the iOS app go to Settings → Delete account, or on the web open the account menu → Delete account.',
        ],
      },
    ],
  },
  vi: {
    title: 'Hỗ trợ',
    updated: '',
    sections: [
      {
        heading: 'Liên hệ',
        paragraphs: [`Có câu hỏi, gặp lỗi hoặc thiếu model máy lọc? Gửi email tới ${SUPPORT_EMAIL}, chúng tôi sẽ phản hồi sớm nhất có thể.`],
      },
      {
        heading: 'Câu hỏi thường gặp',
        items: [
          'Không có model của tôi: chọn model gần nhất, sau khi tạo máy hãy chỉnh chu kỳ từng lõi, rồi gửi email cho chúng tôi tên model.',
          'Nhắc nhở: trên iPhone, bật trong phần Cài đặt của ứng dụng. Bạn sẽ được nhắc vài ngày trước và vào đúng ngày cần thay lõi.',
          'Chia sẻ: mở một máy lọc và chọn Chia sẻ để mời người khác với vai trò người chỉnh sửa (được thay lõi) hoặc người xem (chỉ xem).',
          'Xóa tài khoản: trong ứng dụng iOS vào Cài đặt → Xóa tài khoản, hoặc trên web mở menu tài khoản → Xóa tài khoản.',
        ],
      },
    ],
  },
};

function LegalLayout({ content }: { content: LegalContent }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <AppLogo />
          Water Purifier Manager
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold">{content.title}</h1>
          {content.updated && <p className="mt-1 text-sm text-muted-foreground">{content.updated}</p>}
        </div>
        {content.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            {section.items && (
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.paragraphs?.map((p) => (
              <p key={p} className="text-sm leading-6">
                {p}
              </p>
            ))}
          </section>
        ))}
        <LegalLinks />
      </main>
    </div>
  );
}

export function LegalLinks() {
  const { t } = useTranslation();
  return (
    <nav className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
      <Link to="/privacy" className="hover:underline">
        {t('legal.privacy')}
      </Link>
      <Link to="/support" className="hover:underline">
        {t('legal.support')}
      </Link>
    </nav>
  );
}

function useLanguage(): 'en' | 'vi' {
  const { i18n } = useTranslation();
  return i18n.language === 'vi' ? 'vi' : 'en';
}

export function PrivacyPage() {
  return <LegalLayout content={PRIVACY[useLanguage()]} />;
}

export function SupportPage() {
  return <LegalLayout content={SUPPORT[useLanguage()]} />;
}
