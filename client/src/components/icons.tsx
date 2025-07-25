import {
  HomeIcon, HamburgerMenuIcon, PaperPlaneIcon, ExclamationTriangleIcon,
  ArrowLeftIcon, LayersIcon, PlusIcon, StarIcon, HeartIcon, MinusIcon, DashboardIcon,
  GearIcon, ExitIcon,
  TrashIcon,
  ArrowRightIcon,
  HeartFilledIcon
} from "@radix-ui/react-icons"
import { KeyIcon } from "lucide-react";
export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    </svg>
  ),
  home: HomeIcon,
  hamburger: HamburgerMenuIcon,
  paperPlain: PaperPlaneIcon,
  errorIcon: ExclamationTriangleIcon,
  arrowLeft: ArrowLeftIcon,
  layers: LayersIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  star: StarIcon,
  heartIcon: HeartIcon,
  heartIconFill: HeartFilledIcon,
  dashboard: DashboardIcon,
  setting: GearIcon,
  exit: ExitIcon,
  cart: (props: IconProps) =>
    <svg xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
      {...props}>
      <path strokeLinecap="round"
        strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>,
  trash: TrashIcon,
  arrowRight: ArrowRightIcon,
  keyIcon: KeyIcon




  // card: CardIc


};
