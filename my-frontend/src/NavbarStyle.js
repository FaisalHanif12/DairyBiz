import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BiMenuAltRight, BiMenu } from 'react-icons/bi';

export const Nav = styled.nav`
	background-color: #333;
	color: #fff;
	height: 50px;

	display: flex;
	align-items: center;
`;

export const Container = styled.div`
	width: 100%;
	max-width: 1100px;
	margin: 0 auto;

	display: flex;
	align-items: center;
	justify-content: space-between;

	@media screen and (max-width: ${(props) => props.ss}px) {
		padding: 0 20px;
	}
`;

export const Brand = styled.div`
	width: 150px;
	height: 100%;

	display: grid;
	place-items: center;
`;

export const BrandImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

export const Menu = styled.ul`
	list-style: none;

	display: flex;
	align-items: center;
	column-gap: 10px;

	@media screen and (max-width: ${(props) => props.ss}px) {
		width: 100%;
		padding: 20px;
		flex-direction: column;

		background-color: #333;
		border-top: 1px solid #fff;

		position: absolute;
		top: 50px;
		left: 0;
		z-index: ${(props) => (props.toggleMenu ? '1' : '-1')};

		transform: translateY(-100%) scale(0);
		transition: animation 0.3s ease-in, z-index 0.3s ease 0.5s;

		animation: ${(props) =>
			props.toggleMenu ? 'menuOpen 0.5s linear forwards' : ''};

		@keyframes menuOpen {
			0% {
				transform: translateY(-100%) scale(0);
			}
			50% {
				transform: translateY(-50%) scale(0.5);
			}
			100% {
				transform: translateY(0%) scale(1);
			}
		}
	}
`;

export const MenuItems = styled.li`
	padding: 5px;

	@media screen and (max-width: ${(props) => props.ss}px) {
		opacity: ${(props) => (props.toggleMenu ? '1' : '0')};
		transition: 1s ease-in;
	}
`;

export const NavLink = styled(Link)`
	width: 100%;
	height: 100%;
	padding: 5px;
	display: block;
	text-decoration: none;

	color: #fff;
	font-weight: 400;

	position: relative;

	&:before {
		content: '';
		width: 10px;
		height: 10px;

		position: absolute;
		top: 0;
		left: 0;

		border-top: 1px solid #fff;
		border-left: 1px solid #fff;

		opacity: 0;
		transition: 0.3s ease-out;
	}

	&:after {
		content: '';
		width: 10px;
		height: 10px;

		position: absolute;
		bottom: 0;
		right: 0;

		border-bottom: 1px solid #fff;
		border-right: 1px solid #fff;

		opacity: 0;
		transition: 0.3s ease-out;
	}

	&:hover:before,
	&:hover:after {
		opacity: 1;
	}

	&:active:before,
	&:active:after {
		opacity: 0;
	}
`;

export const MobileMenuContainer = styled.div`
	width: 22px;
	height: 28px;

	position: relative;
	display: ${(props) => (props.menu ? 'grid' : 'none')};
	place-items: center;

	cursor: pointer;
	overflow: hidden;

	&:hover > :last-child {
		transform: translateX(0%);
	}
`;

export const MobileMenu = styled(BiMenuAltRight)`
	font-size: 28px;

	position: absolute;
`;

export const MobileMenuHover = styled(BiMenu)`
	font-size: 28px;

	position: absolute;

	transform: translateX(50%);
	transform-origin: left;
	transition: 0.3s ease-out;
`;
