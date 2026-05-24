import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-primary-foreground py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Логотип и соцсети */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-2xl font-bold mb-6 text-primary flex items-center">
            <span>NextCobec</span>
          </h4>
          <div className="flex space-x-8 mb-6">
            <a
              href="https://t.me/simfart"
              className="text-primary/70 hover:text-primary transition-all duration-300 transform hover:scale-110 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-2"
              aria-label="Telegram">
              <Image
                width={36}
                height={36}
                src="/telegIcon.svg"
                alt="Telegram icon"
              />
            </a>
            <a
              href="https://github.com/Simfort"
              className="text-primary/70 hover:text-primary transition-all duration-300 transform hover:scale-110 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-2"
              aria-label="GitHub">
              <Image
                width={36}
                height={36}
                src="/githubIcon.svg"
                className="rounded-full"
                alt="GitHub icon"
              />
            </a>
          </div>
          <p className="text-primary/80 text-sm max-w-[200px]">
            Следите за нами в соцсетях — всегда на связи!
          </p>
        </div>

        {/* Контакты */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="text-xl font-medium mb-6 text-primary">Контакты</h5>
          <ul className="space-y-4 text-primary/90">
            <li>
              <a
                href="mailto:lemondzavadavid265@gmail.com"
                className="hover:text-primary transition-colors duration-300 flex items-center group">
                <svg
                  className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                lemondzavadavid265@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Юридические ссылки */}
        <div className="flex flex-col items-center md:items-start">
          <h5 className="text-xl font-medium mb-6 text-primary">
            Юридическая информация
          </h5>
          <ul className="space-y-3">
            <li>
              <Link
                href="/interview/ps"
                className="text-primary/90 hover:text-primary transition-colors duration-300 flex items-center group">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors duration-300"></span>
                Пользовательское соглашение
              </Link>
            </li>
            <li>
              <Link
                href="/interview/pk"
                className="text-primary/90 hover:text-primary transition-colors duration-300 flex items-center group">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3 group-hover:bg-primary transition-colors duration-300"></span>
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Нижняя панель */}
      <div className="mt-12 pt-6 border-t border-primary/20 text-center text-primary/60 text-sm">
        <p>NextCobec © {new Date().getFullYear()}. Все права защищены.</p>
      </div>
    </footer>
  );
}
