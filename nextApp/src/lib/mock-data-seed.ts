import { Berth, Port, Terminal, VesselOperator } from "@/data/port";
import {
  Rotation,
  RotationCall,
  RotationCallStatus,
  RotationProforma,
} from "@/data/rotation";
import { Service, ServiceProforma } from "@/data/service";
import { Vessel, VesselType } from "@/data/vessel";
import { faker } from "@faker-js/faker";

import {
  DefaultRecurrency,
  Event,
  EventType,
} from "@/app/(app)/ports/[portId]/sections/eventLog/interfaces";

const genLocation = (): string =>
  `${faker.location.latitude()},${faker.location.longitude()}`;

const genVesselId = (): Rotation["vesselId"] =>
  `${faker.string.alpha({
    length: 4,
    casing: "upper",
  })}${faker.string.numeric({
    length: 4,
  })}`;

const genPortId = (): Terminal["portId"] =>
  faker.string.alpha({
    casing: "upper",
    length: {
      min: 5,
      max: 8,
    },
  });

const genTerminalId = (): Terminal["terminalId"] =>
  faker.string.numeric({
    length: {
      min: 1,
      max: 2,
    },
  });

const genRotationId = (): Rotation["rotationId"] =>
  `${faker.string.alpha({
    length: 4,
    casing: "upper",
  })}${faker.string.numeric({
    length: 4,
  })}`;

const genVessel = (maxLength: number = 150): Vessel => {
  const vessel: Vessel = {
    vesselId: genVesselId(),
    vesselName: faker.vehicle.vehicle(),
    operatorId: faker.string.alpha({ length: 3, casing: "upper" }),
    ownerId: faker.string.alpha({ length: 3, casing: "upper" }),
    vesselType: faker.helpers.arrayElement(
      Object.values(VesselType),
    ) as VesselType,
    length: faker.number.int({ min: 50, max: maxLength }),
  };
  return vessel;
};

const genBerth = (
  berthId?: Berth["berthId"],
  portId?: Terminal["portId"],
  terminalId?: Terminal["terminalId"],
): Berth => {
  const berth: Berth = {
    berthId:
      berthId ||
      faker.string.numeric({
        length: {
          min: 1,
          max: 2,
        },
      }),
    terminalId: terminalId || genTerminalId(),
    portId: portId || genPortId(),
    length: faker.number.int({ min: 100, max: 600 }),
  };
  return berth;
};

export const genRotationData = (
  serviceId: Service["serviceId"],
  vesselId: Rotation["vesselId"],
  rotationId: Rotation["rotationId"],
  portCodes?: string[],
  forecast: boolean = false,
  rotationCalls = 10,
): Rotation => {
  const calls: RotationCall[] = [];
  let start = faker.date.between({
    from: new Date(
      new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
    ) /* 3 days ago */,
    to: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
  });
  for (let i = 0; i < (portCodes ? portCodes.length : rotationCalls); i++) {
    const endMin = new Date(
      start.getTime() + 1 * 24 * 60 * 60 * 1000,
    ); /* 1 day later */
    const endMax = new Date(
      start.getTime() + 4 * 24 * 60 * 60 * 1000,
    ); /* 4 days later */
    const end = faker.date.between({ from: endMin, to: endMax });
    const portName =
      portCodes && portCodes[i]
        ? portCodes[i]
        : `${faker.string.alpha({
            length: { min: 3, max: 5 },
          })}${faker.string.numeric({
            length: { min: 1, max: 2 },
          })}`;
    Object.values(RotationCallStatus).forEach((status, j) => {
      const startTime = j === 0 ? start : calls[calls.length - 1].endTime;
      const endTime = new Date(
        startTime.getTime() + ((end.getTime() - start.getTime()) / 3) * (j + 1),
      );
      calls.push({
        serviceId,
        vesselId,
        rotationId,
        callOrder: i + 1,
        portName,
        callStatus: status as RotationCallStatus,
        startTime,
        endTime,
      });
    });
    start = end;
  }
  const rotation: Rotation = {
    serviceId,
    vesselId,
    rotationId,
    calls,
    operatorId: faker.string.alpha({ length: 3, casing: "upper" }),
    currentCallOrder: faker.number.int({ min: 1, max: rotationCalls }),
    currentCallStatus: faker.helpers.arrayElement(
      Object.values(RotationCallStatus),
    ) as RotationCallStatus,
    isForecast: forecast,
  };
  if (forecast) {
    const forecastStart = faker.date.between({
      from: start.getTime() + 1 * 24 * 60 * 60 * 1000 /* 1 day later */,
      to: new Date(
        start.getTime() + 10 * 24 * 60 * 60 * 1000,
      ) /* 10 days later */,
    });
    rotation.isForecast = true;
    rotation.calls = rotation.calls.map(call => ({
      ...call,
      isForecast: call.startTime.getTime() >= forecastStart.getTime(),
    }));
  }
  return rotation;
};

export const genServiceData = (
  serviceId?: Service["serviceId"],
  vesselIds?: Service["vesselIds"],
  forecast: boolean = false,
  rotationCalls = 10,
): Service => {
  const rotationData: Rotation[] = [];
  if (!serviceId) {
    serviceId = `${faker.helpers.arrayElement([
      "asia",
      "africa",
      "europe",
      "america",
    ])}-${faker.location.country()}`;
  }
  if (!vesselIds) {
    vesselIds = [];
    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
      vesselIds.push(faker.vehicle.vrm());
    }
  }
  for (const vesselId of vesselIds) {
    rotationData.push(
      genRotationData(
        serviceId,
        vesselId,
        genRotationId(),
        undefined,
        forecast,
        rotationCalls,
      ),
    );
  }
  const service: Service = {
    serviceId,
    vesselIds,
    rotationData,
  };
  return service;
};

export const genServiceProforma = (service: Service): ServiceProforma => {
  const proformaId = `V1.${faker.number.int({
    min: 1,
    max: 10,
  })}`;
  const rotationData: RotationProforma[] = [];
  for (const rotation of service.rotationData) {
    const calls: RotationCall[] = [];
    for (const call of rotation.calls) {
      const startTime = new Date(
        call.startTime.getTime() - 1 * 24 * 60 * 60 * 1000,
      ); /* 1 day earlier */
      const endTime = new Date(
        call.endTime.getTime() - 1 * 24 * 60 * 60 * 1000,
      ); /* 1 day earlier */
      calls.push({
        ...call,
        startTime,
        endTime,
      });
    }
    rotationData.push({
      serviceId: rotation.serviceId,
      proformaId,
      rotationId: rotation.rotationId,
      calls,
      startTime: calls[0].startTime,
      endTime: calls[calls.length - 1].endTime,
    } as RotationProforma);
  }
  const serviceProforma: ServiceProforma = {
    serviceId: service.serviceId,
    proformaId,
    rotationData,
  };
  return serviceProforma;
};

export const genRotationProforma = (rotation: Rotation): RotationProforma => {
  const proformaId = `V1.${faker.number.int({
    min: 1,
    max: 10,
  })}`;
  const calls: RotationCall[] = [];
  for (const call of rotation.calls) {
    const startTime = new Date(
      call.startTime.getTime() - 1 * 24 * 60 * 60 * 1000,
    ); /* 1 day earlier */
    const endTime = new Date(
      call.endTime.getTime() - 1 * 24 * 60 * 60 * 1000,
    ); /* 1 day earlier */
    calls.push({
      ...call,
      startTime,
      endTime,
    });
  }
  const rotationProforma: RotationProforma = {
    serviceId: rotation.serviceId,
    proformaId,
    rotationId: rotation.rotationId,
    calls,
    startTime: calls[0].startTime,
    endTime: calls[calls.length - 1].endTime,
  };
  return rotationProforma;
};

export const genTerminalData = (
  berthRange: [number, number] = [2, 5],
  vesselRange: [number, number] = [3, 10],
): Terminal => {
  const portId = genPortId();
  const terminalId = genTerminalId();
  const terminalEvents: Event[] = [];
  const berthData: Berth[] = [];
  const vesselData: Vessel[] = [];
  const terminalData: Terminal["terminalData"] = [];
  let lastEventEndTime = new Date(
    new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
  ); /* 3 days ago */
  for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
    const type = faker.helpers.arrayElement(
      Object.values(EventType).filter(
        type => !terminalEvents.map(event => event.type).includes(type),
      ),
    ) as EventType;
    const start = new Date(
      lastEventEndTime.getTime() +
        faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000,
    ); // 1 to 3 days after the end of the last event
    const end = new Date(
      start.getTime() +
        faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000,
    ); // 1 to 3 days after the start of the event
    terminalEvents.push({
      id: i.toString(),
      type,
      start,
      end,
      allDay: false,
      description: faker.lorem.sentence(),
      title: type.toString(),
      impactScore: faker.number.int({ min: 1, max: 5 }),
      likelihoodScore: faker.number.int({ min: 1, max: 5 }),
      reportedBy: faker.person.firstName() + " " + faker.person.lastName(),
      portCode: portId,
      terminals: [terminalId],
      recurrence: DefaultRecurrency,
      timezone: "Asia/Singapore",
    });
    lastEventEndTime = end;
  }
  for (
    let i = 0;
    i < faker.number.int({ min: berthRange[0], max: berthRange[1] });
    i++
  ) {
    const berth = genBerth(i.toString(), portId, terminalId);
    const berthVessels: Vessel[] = [];
    berthData.push(berth);
    for (
      let j = 0;
      j < faker.number.int({ min: vesselRange[0], max: vesselRange[1] });
      j++
    ) {
      const vessel = genVessel();
      berthVessels.push(vessel);
      vesselData.push(vessel);
    }
    let previousEndTime = new Date(
      new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    ); // 4 days ago
    berthVessels.forEach(({ vesselId }) => {
      const startTime = new Date(
        previousEndTime.getTime() + 1 * 24 * 60 * 60 * 1000,
      ); // 1 day after previous end time
      const endTime = new Date(startTime.getTime() + 3 * 24 * 60 * 60 * 1000); // 1 day after start time
      let windowStartTime = new Date(
        startTime.getTime() +
          faker.number.int({ min: -1, max: 1 }) * 24 * 60 * 60 * 1000,
      ); // -1 to 1 days from start time
      let windowEndTime = new Date(
        endTime.getTime() +
          faker.number.int({ min: -1, max: 1 }) * 24 * 60 * 60 * 1000,
      ); // -1 to 1 days from end time
      let proformaStartTime = new Date(
        startTime.getTime() +
          faker.number.int({ min: -1, max: 1 }) * 24 * 60 * 60 * 1000,
      ); // -1 to 1 days from start time
      let proformaEndTime = new Date(
        endTime.getTime() +
          faker.number.int({ min: -1, max: 1 }) * 24 * 60 * 60 * 1000,
      ); // -1 to 1 days from end time
      if (windowStartTime > windowEndTime) {
        [windowStartTime, windowEndTime] = [windowEndTime, windowStartTime];
      }
      if (proformaStartTime > proformaEndTime) {
        [proformaStartTime, proformaEndTime] = [
          proformaEndTime,
          proformaStartTime,
        ];
      }
      terminalData.push({
        vesselId,
        berthId: berth.berthId,
        startTime,
        endTime,
        windowStartTime,
        windowEndTime,
        proformaStartTime,
        proformaEndTime,
        operatorId: faker.helpers.arrayElement(
          Object.values(VesselOperator),
        ) as VesselOperator,
      });
      previousEndTime = endTime;
    });
  }
  const terminal: Terminal = {
    terminalId,
    terminalLocation: genLocation(),
    portId,
    berthData,
    events: terminalEvents,
    terminalData,
    vesselData,
  };
  return terminal;
};

export const genPortData = (
  terminalRange: [number, number] = [2, 5],
  berthRange: [number, number] = [2, 5],
  vesselRange: [number, number] = [3, 10],
): Port => {
  const portId = genPortId();
  const portEvents: Event[] = [];
  const terminalData: Terminal[] = [];
  let lastEventEndTime = new Date(
    new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
  ); /* 3 days ago */
  for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
    const type = faker.helpers.arrayElement(
      Object.values(EventType).filter(
        type => !portEvents.map(event => event.type).includes(type),
      ),
    ) as EventType;
    const start = new Date(
      lastEventEndTime.getTime() +
        faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000,
    ); // 1 to 3 days after the end of the last event
    const end = new Date(
      start.getTime() +
        faker.number.int({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000,
    ); // 1 to 3 days after the start of the event
    portEvents.push({
      id: i.toString(),
      type,
      start,
      end,
      allDay: false,
      title: type.toString(),
      description: faker.lorem.sentence(),
      likelihoodScore: faker.number.int({ min: 1, max: 5 }),
      impactScore: faker.number.int({ min: 1, max: 5 }),
      reportedBy: faker.person.firstName() + " " + faker.person.lastName(),
      portCode: portId,
      terminals: [],
      recurrence: DefaultRecurrency,
      timezone: "Asia/Singapore",
    });
    lastEventEndTime = end;
  }
  for (
    let i = 0;
    i < faker.number.int({ min: terminalRange[0], max: terminalRange[1] });
    i++
  ) {
    terminalData.push(genTerminalData(berthRange, vesselRange));
  }
  const port: Port = {
    portId,
    portName: portId,
    portUrl: faker.internet.url(),
    portLocation: genLocation(),
    events: portEvents,
    terminalData,
  };
  return port;
};
