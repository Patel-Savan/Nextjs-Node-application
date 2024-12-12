import Link from "next/link";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  NavDropdown
} from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store"; // Access the searchHistoryAtom
import { isAuthenticated, removeToken, readToken } from "@/lib/authenticate"; // Import authentication functions
import { addToHistory } from "@/lib/userData"; // Import API function to add to search history

export default function MainNav() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false); // State to handle navbar expansion
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // Access the search history atom
  const [userName, setUserName] = useState(null); // Store the logged-in user's name

  useEffect(() => {
    if (isAuthenticated()) {
      const token = readToken();
      setUserName(token.userName); // Extract the username from the token
    } else {
      setUserName(null);
    }
  }, [router]); // Update when the route changes (e.g., after login/logout)

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchField = event.target.elements.search.value;
    if (searchField) {
      setSearchHistory((currentHistory) => [
        ...currentHistory,
        `title=true&q=${searchField}`
      ]); // Add query to search history
      const query = `title=true&q=${searchField}`;
      await addToHistory(query);
      router.push(`/artwork?title=true&q=${searchField}`); // Navigate to the artwork page with search query
      setIsExpanded(false); // Collapse navbar after search
    }
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded); // Toggle navbar visibility
  };

  const closeNavbar = () => {
    setIsExpanded(false); // Close navbar when a link is clicked
  };

  const handleLogout = () => {
    removeToken(); // Remove the JWT token
    setUserName(null); // Clear the username
    router.push("/login"); // Redirect to the login page
  };

  return (
    <>
      <Navbar
        className="fixed-top navbar-dark"
        expand="lg"
        style={{ backgroundColor: "#004080" }}
        expanded={isExpanded}
      >
        <Container fluid>
          <Navbar.Brand className="text-white">
            Jayneel Pratap Jain
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={toggleNavbar}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-center">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  active={router.pathname === "/"}
                  onClick={closeNavbar}
                >
                  Home
                </Nav.Link>
              </Link>
              {userName && (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={closeNavbar}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            <Nav className="ms-3">
              {userName ? (
                <>
                  <Form
                    className="d-flex align-items-center"
                    onSubmit={handleSearch}
                  >
                    <FormControl
                      type="search"
                      name="search"
                      placeholder="Search Artwork"
                      className="me-2"
                    />
                    <Button type="submit" variant="outline-light">
                      Search
                    </Button>
                  </Form>
                  <NavDropdown title="Jayneel Pratap Jain" id="user-dropdown">
                    <Link href="/favourites" passHref legacyBehavior>
                      <NavDropdown.Item
                        active={router.pathname === "/favourites"}
                        onClick={closeNavbar}
                      >
                        Favourites
                      </NavDropdown.Item>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <NavDropdown.Item
                        active={router.pathname === "/history"}
                        onClick={closeNavbar}
                      >
                        Search History
                      </NavDropdown.Item>
                    </Link>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/login"}
                      onClick={closeNavbar}
                    >
                      Login
                    </Nav.Link>
                  </Link>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/register"}
                      onClick={closeNavbar}
                    >
                      Register
                    </Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}
