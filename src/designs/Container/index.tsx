import { FC } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const ContainerContainer = styled.div`
  ${tw`container mx-auto`}
`;

interface IContainer {}

const Container: FC<IContainer> = ({ children }) => {
  return <ContainerContainer>{children}</ContainerContainer>;
};

export default Container;
