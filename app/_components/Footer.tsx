import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex bg-secondary text-background/50 py-5 flex-col items-center text-sm justify-center">
      <div className="flex items-center flex-col gap-5 justify-center px-5 ">
        <div className="flex items-center justify-between w-full">
          <a href="https://t.me/simfart">
            <Image
              width={50}
              height={50}
              src={"/telegIcon.svg"}
              alt="Telegram icon"
            />
          </a>{" "}
          <a href="https://github.com/Simfort">
            <Image
              width={50}
              height={50}
              src={"/githubIcon.svg"}
              className="bg-background  rounded-full"
              alt="Telegram icon"
            />
          </a>
        </div>{" "}
        <div className="flex gap-99 items-center max-sm:gap-6">
          {" "}
          <div className="flex flex-col gap-2">
            <h5>NextCobec © 2026</h5>
            <p>E-Mail: lemondzavadavid265@gmail.com</p>
          </div>
          <div className="flex flex-col gap-2">
            {" "}
            <Link href="/interview/ps">Пользовательское соглашение</Link>
            <Link href="/interview/pk">Политика конфидециальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
