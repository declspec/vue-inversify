import { interfaces } from 'inversify';
import Vue, { PluginFunction } from 'vue';
declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        container?: interfaces.Container;
    }
}
declare module "vue/types/vue" {
    interface Vue {
        $container?: interfaces.Container;
    }
}
declare const VueInversify: PluginFunction<any>;
declare const inject: (identifier?: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any> | undefined) => (target: Vue, prop: string) => void;
export default VueInversify;
export { inject };
