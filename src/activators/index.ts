

import { DefaultActivator } from './defaultActivator';
import { HostnameActivator } from './hostnameActivator';
import { GradualRolloutRandomActivator } from './gradualRolloutRandomActivator';
import { GradualRolloutUserIdActivator } from './gradualRolloutUserIdActivator';
import { GradualRolloutSessionIdActivator } from './gradualRolloutSessionIdActivator';
import { UserIdActivator } from './userIdActivator';
import { RemoteAddressActivator } from './remoteAddressActivator';
import { FlexibleRolloutActivator }  from './flexibleRolloutActivator';
import { Activator } from './activator';
export { Activator } from './activator';
//export { ActivatorTransportInterface } from './Activator';

export const defaultStrategies: Array<Activator> = [
    new DefaultActivator(),
    new HostnameActivator(),
    new GradualRolloutRandomActivator(),
    new GradualRolloutUserIdActivator(),
    new GradualRolloutSessionIdActivator(),
    new UserIdActivator(),
    new RemoteAddressActivator(),
    new FlexibleRolloutActivator(),
];