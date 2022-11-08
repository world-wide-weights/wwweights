/**
 * Footer
 */
export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="py-1 bg-gray-100 text-center">
        <div className="md:flex justify-evenly">

          <div className="font-semibold text-gray-500 pb-5 pt-5">
            WWWeights Copyright © {new Date().getFullYear()}
          </div>

          <div className="grid text-base text-gray-500 pb-5 md:inline md:pt-5">
            <a href="#" className="hover:text-blue-500 md:pr-4">
              Imprint
            </a>
            <a href="#" className=" hover:text-blue-500">
              Privacy Policy
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
