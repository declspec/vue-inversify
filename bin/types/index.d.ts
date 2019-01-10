import 'reflect-metadata';
import { interfaces } from 'inversify';
import Vue, { VueConstructor } from 'vue';
declare type VueInversifyOptions = {
    container: interfaces.Container;
};
export default function VueInversify(instance: VueConstructor<Vue>, options?: VueInversifyOptions): void;
export declare function inject(identifier?: interfaces.ServiceIdentifier<any>): (target: Vue, prop: string) => void;
export {};
