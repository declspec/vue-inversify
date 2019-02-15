import { interfaces } from 'inversify';
import Vue, { PluginFunction } from 'vue';

declare var Reflect: any;

type InjectableVueClass = {
    new (...args: any[]) : Vue;
    $inject?: { [key: string]: interfaces.ServiceIdentifier<any> }
};

const VueInversify: PluginFunction<any> = instance => {
    instance.mixin({
        beforeCreate() {
            if (this.$options.container) 
                this.$container = this.$options.container;
            else {
                // Cascade the '$container' down all children as they're created
                const root = (this.$parent || this);
                this.$container = root.$container;
            }

            const $inject = (this.constructor as InjectableVueClass).$inject;
            const container = this.$container;
            
            if ($inject) {
                if (!container)
                    throw new TypeError('vue-inversify: encountered props marked with @inject but no container was provided when creating the Vue instance');

                Object.keys($inject).forEach(key => {
                    Object.defineProperty(this, key, {
                        enumerable: true,
                        value: container.get($inject[key])
                    });
                });
            }
        }
    });
};

const inject = (identifier?: interfaces.ServiceIdentifier<any>) => {
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
};

export default VueInversify;
export { inject };
