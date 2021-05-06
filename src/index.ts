import { interfaces } from 'inversify';
import { PluginFunction } from 'vue/types/plugin';
import { Vue } from 'vue/types/vue';
import { createDecorator } from 'vue-class-component'

declare const Reflect: {
    getMetadata(metadataKey: string, target: unknown, propertyKey: string): unknown;
};

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        container?: interfaces.Container;
        dependencies?: { [key: string]: interfaces.ServiceIdentifier<unknown> };
    }
}

const VueInversify: PluginFunction<unknown> = instance => {
    instance.mixin({
        beforeCreate() {
            const dependencies = this.$options.dependencies;
            
            if (dependencies) {
                const container = this.$options.container || (this.$options.container = getContainer(this));

                if (!container)
                    throw new TypeError('vue-inversify: encountered props marked with @inject but no container was provided when creating the Vue instance');
                
                Object.keys(dependencies).forEach(key => {
                    if (Object.getOwnPropertyDescriptor(this, key))
                        return;

                    Object.defineProperty(this, key, {
                        enumerable: true,
                        value: container.get(dependencies[key])
                    });
                });            
            }
        }
    });
};

const inject = (identifier?: interfaces.ServiceIdentifier<unknown>) => {
    return function(target: Vue, prop: string) {
        createDecorator((options, key) => {
            // Try use reflection to generate the identifier if not provided explicitly.
            if (!identifier && typeof(Reflect) !== 'undefined' && typeof(Reflect.getMetadata) === 'function')
                identifier = Reflect.getMetadata('design:type', target, prop) as interfaces.ServiceIdentifier<unknown>;

            if (!identifier)
                throw new TypeError('vue-inversify: Unable to resolve identifier; please specify it explicitly');

            const dependencies = options.dependencies || (options.dependencies = {});
            dependencies[key] = identifier;
        })(target, prop);
    }
};

function getContainer(component: Vue) {
    let container: interfaces.Container | undefined;

    while (component != null && !container) {
        container = component.$options.container;
        component = component.$parent;
    }

    return container;
}

export default VueInversify;
export { inject };
