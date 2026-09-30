import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-krypton-surface bg-krypton-bg text-zinc-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-zinc-200">
            Krypton &copy; {new Date().getFullYear()} — Built by Rohan Chavan
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            BSc. Computer Science • Web3 & Full-Stack Developer
          </p>
        </div>

        <div className="flex items-center gap-5 text-zinc-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-krypton-gold transition-colors"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-krypton-gold transition-colors"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-krypton-gold transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a
            href="mailto:chavanrohan4333@gmail.com"
            aria-label="Email"
            className="hover:text-krypton-gold transition-colors"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}