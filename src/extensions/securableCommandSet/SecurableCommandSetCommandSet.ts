import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import { sp, SPConfiguration } from "@pnp/sp";

import * as strings from 'SecurableCommandSetCommandSetStrings';
import { SiteGroups, SiteGroup } from '@pnp/sp/src/sitegroups';
import { SiteUser, SiteUsers } from '@pnp/sp/src/siteusers';
import { SPUser } from '@microsoft/sp-page-context';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISecurableCommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'SecurableCommandSetCommandSet';

export default class SecurableCommandSetCommandSet extends BaseListViewCommandSet<ISecurableCommandSetCommandSetProperties> {

  private isInOwnersGroup: boolean = false;

  @override
  public async onInit(): Promise<void> {

    await super.onInit();

    await sp.setup({ spfxContext: this.context });

    const email: string = this.context.pageContext.user.email;
    const ownerGroup: SiteGroup = sp.web.associatedOwnerGroup;
    const users: SPUser[] = await ownerGroup.users.get();

    this.isInOwnersGroup = users.some((user: any) => user.Email === email);

    return Promise.resolve<void>();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareSecureCommand: Command = this.tryGetCommand('CMD_SECURE');
    if (compareSecureCommand) {

      compareSecureCommand.visible = this.isInOwnersGroup;
    }
    
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'CMD_SECURE':
        Dialog.alert("Shhhhhh! It's a secret...");
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
