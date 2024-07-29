"use server";

/* import { getVesselArrivingTerminal } from "./actions";
 */
import { TerminalLineUp } from "./TerminalLineUp";

type IProps = {
  terminalId: string;
};

export async function TerminalLineUpSC({}: IProps) {
  /*   const vesselArrivngTerminal = await getVesselArrivingTerminal(terminalId);
   */
  return (
    <>
      <TerminalLineUp allVesselsArriving={[]} />
    </>
  );
}
