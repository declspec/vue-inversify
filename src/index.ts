import 'reflect-metadata';

import { interfaces } from 'inversify';
import Vue, { VueConstructor } from 'vue';

type VueInversifyOptions = {
    container: interfaces.Container;
};

type InjectableVueClass = {
    new (...args: any[]) : Vue;
    $inject?: { [key: string]: interfaces.ServiceIdentifier<any> }
};

export default function VueInversify(instance: VueConstructor<Vue>, options: VueInversifyOptions) {
    const { container } = options;

    instance.mixin({
        beforeCreate() {
            const $inject = (this.constructor as InjectableVueClass).$inject;

            if ($inject) {
                Object.keys($inject).forEach(key => {
                    Object.defineProperty(this, key, {
                        enumerable: true,
                        value: container.get($inject[key])
                    });
                });
            }
        }
    });
}

export function inject(identifier?: interfaces.ServiceIdentifier<any>) {
    return function(target: Vue, prop: string) {
        // Try use reflection to generate the identifier if not provided explicitly.
        if (!identifier && typeof(Reflect) !== 'undefined' && typeof(Reflect.getMetadata) === 'function')
            identifier = Reflect.getMetadata('design:type', target, prop);

        if (!identifier)
            throw new TypeError('Unable to resolve identifier; please specify it explicitly');

        const injectable = (typeof(target) === 'function' ? target : target.constructor) as InjectableVueClass;
        const $inject = injectable.$inject || (injectable.$inject = {});

        $inject[prop] = identifier;
    }
}