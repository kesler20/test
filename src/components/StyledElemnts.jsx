import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin: 10px;
`;

export const SideBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 5rem;
  margin: 0;
  display: flex;
  align-items: center;
  background-color: black;
  flex-direction: column;
`;

export const Cards = styled.div`
  text-decoration: none;
  font-size:1.5rem;
  font-weight400;
  
  font-family: 'Lobster Two', cursive;
`;

export const Grid = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  padding: 4px;
  height: 100%;
  grid-template-columns: repeat(2, 1fr);
  svg {
    font-size: 2rem;
  }
`;

export const DragBtn = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: darkcyan;
  color: #fff;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  box-shadow: 5px 5px 40px #000;
  outline: none;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #9050cc;
    color: white;
  }

  td,
  th {
    border: 1px solid #ddd;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  input {
    background: transparent;
    border: none;
    border-bottom: 1px solid black;
    outline: none;
    font-size: 17px;
  }
`;

export const DangerBtn = styled.button`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 0, 1) 0%,
    rgba(255, 59, 0, 1) 34%
  );
  border: none;
  color: white;
`;

export const PrimaryBtn = styled.button`
  /* global 92%+ browsers support */
  background: radial-gradient(
    circle at 36% 39%,
    rgba(76, 175, 80, 1) 0%,
    rgba(25, 133, 90, 1) 100%
  );
  border: none;
  color: white;
  :hover {
    box-shadow: 5px 5px 40px rgb(187, 187, 187);
  }
`;

export const AddRowBtn = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  color: #8d38cd;
  border: none;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 40px rgb(158, 158, 158);
  outline: none;
  margin: 10% 30% 5%;

  :hover {
    box-shadow: 5px 5px 40px rgb(124, 121, 121);
  }
`;
