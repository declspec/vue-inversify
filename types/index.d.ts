import { interfaces } from 'inversify';
import { PluginFunction } from 'vue/types/plugin';
import { Vue } from 'vue/types/vue';
declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        container?: interfaces.Container;
        dependencies?: {
            [key: string]: interfaces.ServiceIdentifier<unknown>;
        };
    }
}
declare const VueInversify: PluginFunction<unknown>;
declare const inject: (identifier?: string | symbol | interfaces.Newable<unknown> | interfaces.Abstract<unknown> | undefined) => (target: Vue, prop: string) => void;
export default VueInversify;
export { inject };
