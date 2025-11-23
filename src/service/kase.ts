export interface Kase {

    connections: string[];

    addConnection(kase: Kase): void;

    positionKey(): string;
}
