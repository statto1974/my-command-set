declare interface ISecurableCommandSetCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'SecurableCommandSetCommandSetStrings' {
  const strings: ISecurableCommandSetCommandSetStrings;
  export = strings;
}
