import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                DocFlow
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The modern document editor for teams who want to collaborate in
              real-time.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} DocFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
