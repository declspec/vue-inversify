import Vue from 'vue';
import { interfaces } from 'inversify/dts/interfaces/interfaces';

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
