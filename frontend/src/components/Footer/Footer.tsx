import { routes } from "../../services/routes/routes";
import { Button } from "../Button/Button";

/**
 * Footer
 */
export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="bg-white text-center mt-10 py-5">
        <div className="container flex flex-col items-center md:flex-row md:justify-between">
          {/* Copyright */}
          <div className="text-gray-600 pb-5 md:pb-0">
            World Wide Weights Copyright © {new Date().getFullYear()}
          </div>

          {/* Links */}
          <ul className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <li><Button to={routes.legal.imprint} kind="tertiary">Imprint</Button></li>
            <li><Button to={routes.legal.privacy} kind="tertiary">Privacy Policy</Button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
