/**
 * Footer
 */
export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="py-1 bg-gray-100 text-center">
        <p className="text-center font-semibold text-gray-500 pb-5 pt-5">
          WWWeights Copyright © {new Date().getFullYear()}
        </p>
        <div className="grid pb-5 text-base text-gray-500">
          <a href="#">Imprint</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};
