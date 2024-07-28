import { useEffect, useState } from 'react';
import {
	Brand,
	Container,
	NavLink,
	Menu,
	MenuItems,
	Nav,
	MobileMenu,
	MobileMenuContainer,
	MobileMenuHover,
} from './NavbarStyle';
import { NavbarData } from './NavbarData';
export default function Navbar() {
	const screenSize = 580;
	const [menu, setMenu] = useState(false);
	const [toggleMenu, setToggleMenu] = useState(false);

	// Close menu function
	const closeMenu = () => {
		setToggleMenu(false);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < screenSize) setMenu(true);
			else setMenu(false);
		}

		// Attach the event listener
		window.addEventListener('resize', handleResize);

		// Call the handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div>
			<Nav>
				<Container ss={screenSize}>
					<Brand>
						<h4 style={{
							fontFamily: "'Dancing Script', cursive", // Stylish font
							fontSize: '1em', // Font size
							color: 'white', // Color of the text
							textAlign: 'center', // Center align text
							margin: '0', // Remove default margin
							textShadow: '2px 2px 4px rgba(0,0,0,0.3)', // Text shadow for depth

						}}>Maher Dairy Farm</h4>

					</Brand>
					<MobileMenuContainer
						menu={menu}
						onClick={() => setToggleMenu(!toggleMenu)}
					>
						<MobileMenu />
						<MobileMenuHover />
					</MobileMenuContainer>
					<Menu toggleMenu={toggleMenu} ss={screenSize}>
						{NavbarData.map((item, index) => (
							<MenuItems key={index} toggleMenu={toggleMenu} ss={screenSize} onClick={closeMenu}>
								<NavLink to={item.link}>{item.title}</NavLink>
							</MenuItems>
						))}
					</Menu>
				</Container>
			</Nav>
		</div>
	);
}
