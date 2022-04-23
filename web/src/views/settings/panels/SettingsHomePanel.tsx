import React from 'react'

import { AppearanceType } from '@vkontakte/vk-bridge'
import { FormItem, FormLayout, Group, SegmentedControl } from '@vkontakte/vkui'

import { BasePanel } from '../../../components/BasePanel'
import { IPanelProps } from '../../../types'

export class SettingsHomePanel extends React.Component<IPanelProps, any> {
  render() {
    return (
      <BasePanel {...this.props} header="Настройки">
        <Group>
          <FormLayout>
            <FormItem top="Тема">
              <SegmentedControl
                size="m"
                name="appearance"
                value={this.props.info.appearance}
                onChange={(value) =>
                  this.props.info.setAppearance(
                    value!.toString() as AppearanceType
                  )
                }
                options={[
                  { label: 'Темная', value: 'dark' },
                  { label: 'Светлая', value: 'light' }
                ]}
              />
            </FormItem>
          </FormLayout>
        </Group>
      </BasePanel>
    )
  }
}
