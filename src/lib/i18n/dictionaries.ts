export type Locale = 'kk' | 'ru' | 'en';

export const LOCALES: Locale[] = ['kk', 'ru', 'en'];

export const LOCALE_LABELS: Record<Locale, string> = {
  kk: 'Қаз',
  ru: 'Рус',
  en: 'Eng',
};

const dictionaries: Record<Locale, Record<string, string>> = {
  kk: {
    site_name: 'Ақпарат', site_tagline: 'Жаңалықтар порталы',
    nav_home: 'Басты бет', nav_categories: 'Санаттар', nav_login: 'Кіру', nav_register: 'Тіркелу',
    nav_logout: 'Шығу', nav_profile: 'Профиль', nav_admin: 'Басқару панелі', nav_search_placeholder: 'Іздеу...',

    news_latest: 'Соңғы жаңалықтар', news_popular: 'Танымал', news_featured: 'Таңдаулы',
    news_related: 'Ұқсас жаңалықтар', news_view_all: 'Барлығын көру', news_views: 'қаралым',
    news_min_read: 'мин оқу', news_share: 'Бөлісу', news_bookmark: 'Сақтау', news_bookmarked: 'Сақталды',
    news_author: 'Автор', news_no_news: 'Жаңалықтар жоқ', news_breaking: 'ЖЕДЕЛ',
    news_all_news: 'Барлық жаңалықтар', news_filter: 'Сүзгі', news_sort_latest: 'Жаңадан ескіге',
    news_sort_popular: 'Танымалдылығы бойынша', news_all: 'Барлығы', news_like: 'Ұнату',
    news_source: 'Дереккөз', news_view_original: 'Түпнұсқа дереккөзді ашу',

    comments_title: 'Пікірлер', comments_placeholder: 'Пікіріңізді жазыңыз...', comments_submit: 'Жіберу',
    comments_login_required: 'Пікір қалдыру үшін жүйеге кіріңіз', comments_reply: 'Жауап беру',
    comments_delete: 'Өшіру', comments_empty: 'Әзірге пікірлер жоқ',

    footer_contact: 'Байланыс', footer_address: 'Алматы қ., Абай даңғылы, 52',
    footer_rights: 'Барлық құқықтар қорғалған.', footer_quick_links: 'Жылдам сілтемелер',
    footer_privacy: 'Құпиялылық саясаты', footer_terms: 'Пайдалану ережелері',

    auth_login_title: 'Жүйеге кіру', auth_login_subtitle: 'Аккаунтыңызға кіріңіз',
    auth_register_title: 'Тіркелу', auth_register_subtitle: 'Жаңа аккаунт жасаңыз',
    auth_email: 'Email', auth_password: 'Құпия сөз', auth_confirm_password: 'Құпия сөзді растаңыз',
    auth_name: 'Аты-жөні', auth_phone: 'Телефон', auth_login_button: 'Кіру', auth_register_button: 'Тіркелу',
    auth_no_account: 'Аккаунтыңыз жоқ па?', auth_have_account: 'Аккаунтыңыз бар ма?',
    auth_register_link: 'Тіркелу', auth_login_link: 'Кіру', auth_failed: 'Email немесе құпия сөз қате',

    profile_title: 'Жеке профиль', profile_personal_info: 'Жеке ақпарат', profile_full_name: 'Толық аты-жөні',
    profile_bio: 'Өзім туралы', profile_save_changes: 'Өзгерістерді сақтау',
    profile_change_password: 'Құпия сөзді өзгерту', profile_current_password: 'Қазіргі құпия сөз',
    profile_new_password: 'Жаңа құпия сөз', profile_update_password: 'Құпия сөзді жаңарту',
    profile_updated: 'Профиль сәтті жаңартылды!', profile_password_updated: 'Құпия сөз сәтті жаңартылды!',

    common_loading: 'Жүктелуде...', common_error: 'Қате орын алды', common_search: 'Іздеу',
    common_read_more: 'Толығырақ', common_end_of_list: 'Барлық жаңалықтар көрсетілді',
    common_history: 'Қаралған жаңалықтар', common_clear: 'Тазалау', common_empty_history: 'Әзірге тарих бос',
  },
  ru: {
    site_name: 'Информ', site_tagline: 'Новостной портал',
    nav_home: 'Главная', nav_categories: 'Категории', nav_login: 'Войти', nav_register: 'Регистрация',
    nav_logout: 'Выйти', nav_profile: 'Профиль', nav_admin: 'Панель управления', nav_search_placeholder: 'Поиск...',

    news_latest: 'Последние новости', news_popular: 'Популярные', news_featured: 'Избранные',
    news_related: 'Похожие новости', news_view_all: 'Смотреть все', news_views: 'просмотров',
    news_min_read: 'мин чтения', news_share: 'Поделиться', news_bookmark: 'Сохранить', news_bookmarked: 'Сохранено',
    news_author: 'Автор', news_no_news: 'Новостей нет', news_breaking: 'СРОЧНО',
    news_all_news: 'Все новости', news_filter: 'Фильтр', news_sort_latest: 'Сначала новые',
    news_sort_popular: 'По популярности', news_all: 'Все', news_like: 'Нравится',
    news_source: 'Источник', news_view_original: 'Открыть оригинал источника',

    comments_title: 'Комментарии', comments_placeholder: 'Напишите комментарий...', comments_submit: 'Отправить',
    comments_login_required: 'Войдите, чтобы оставить комментарий', comments_reply: 'Ответить',
    comments_delete: 'Удалить', comments_empty: 'Пока нет комментариев',

    footer_contact: 'Контакты', footer_address: 'г. Алматы, проспект Абая, 52',
    footer_rights: 'Все права защищены.', footer_quick_links: 'Быстрые ссылки',
    footer_privacy: 'Политика конфиденциальности', footer_terms: 'Условия использования',

    auth_login_title: 'Вход в систему', auth_login_subtitle: 'Войдите в свой аккаунт',
    auth_register_title: 'Регистрация', auth_register_subtitle: 'Создайте новый аккаунт',
    auth_email: 'Email', auth_password: 'Пароль', auth_confirm_password: 'Подтвердите пароль',
    auth_name: 'ФИО', auth_phone: 'Телефон', auth_login_button: 'Войти', auth_register_button: 'Зарегистрироваться',
    auth_no_account: 'Нет аккаунта?', auth_have_account: 'Уже есть аккаунт?',
    auth_register_link: 'Зарегистрируйтесь', auth_login_link: 'Войти', auth_failed: 'Неверный email или пароль',

    profile_title: 'Личный профиль', profile_personal_info: 'Личная информация', profile_full_name: 'Полное имя',
    profile_bio: 'О себе', profile_save_changes: 'Сохранить изменения',
    profile_change_password: 'Сменить пароль', profile_current_password: 'Текущий пароль',
    profile_new_password: 'Новый пароль', profile_update_password: 'Обновить пароль',
    profile_updated: 'Профиль успешно обновлен!', profile_password_updated: 'Пароль успешно обновлен!',

    common_loading: 'Загрузка...', common_error: 'Произошла ошибка', common_search: 'Поиск',
    common_read_more: 'Подробнее', common_end_of_list: 'Показаны все новости',
    common_history: 'Просмотренные новости', common_clear: 'Очистить', common_empty_history: 'История пуста',
  },
  en: {
    site_name: 'NewsPortal', site_tagline: 'News Portal',
    nav_home: 'Home', nav_categories: 'Categories', nav_login: 'Login', nav_register: 'Register',
    nav_logout: 'Logout', nav_profile: 'Profile', nav_admin: 'Admin Panel', nav_search_placeholder: 'Search...',

    news_latest: 'Latest News', news_popular: 'Popular', news_featured: 'Featured',
    news_related: 'Related News', news_view_all: 'View All', news_views: 'views',
    news_min_read: 'min read', news_share: 'Share', news_bookmark: 'Bookmark', news_bookmarked: 'Bookmarked',
    news_author: 'Author', news_no_news: 'No news found', news_breaking: 'BREAKING',
    news_all_news: 'All News', news_filter: 'Filter', news_sort_latest: 'Latest first',
    news_sort_popular: 'Most popular', news_all: 'All', news_like: 'Like',
    news_source: 'Source', news_view_original: 'View original source',

    comments_title: 'Comments', comments_placeholder: 'Write a comment...', comments_submit: 'Submit',
    comments_login_required: 'Please login to leave a comment', comments_reply: 'Reply',
    comments_delete: 'Delete', comments_empty: 'No comments yet',

    footer_contact: 'Contact', footer_address: 'Almaty, Abay Ave., 52',
    footer_rights: 'All rights reserved.', footer_quick_links: 'Quick Links',
    footer_privacy: 'Privacy Policy', footer_terms: 'Terms of Use',

    auth_login_title: 'Sign In', auth_login_subtitle: 'Login to your account',
    auth_register_title: 'Create Account', auth_register_subtitle: 'Register a new account',
    auth_email: 'Email', auth_password: 'Password', auth_confirm_password: 'Confirm Password',
    auth_name: 'Full Name', auth_phone: 'Phone', auth_login_button: 'Sign In', auth_register_button: 'Register',
    auth_no_account: "Don't have an account?", auth_have_account: 'Already have an account?',
    auth_register_link: 'Register', auth_login_link: 'Sign In', auth_failed: 'Invalid email or password',

    profile_title: 'Personal Profile', profile_personal_info: 'Personal Information', profile_full_name: 'Full Name',
    profile_bio: 'About Me', profile_save_changes: 'Save Changes',
    profile_change_password: 'Change Password', profile_current_password: 'Current Password',
    profile_new_password: 'New Password', profile_update_password: 'Update Password',
    profile_updated: 'Profile updated successfully!', profile_password_updated: 'Password updated successfully!',

    common_loading: 'Loading...', common_error: 'Something went wrong', common_search: 'Search',
    common_read_more: 'Read more', common_end_of_list: 'All news shown',
    common_history: 'Recently viewed', common_clear: 'Clear', common_empty_history: 'History is empty',
  },
};

export default dictionaries;
