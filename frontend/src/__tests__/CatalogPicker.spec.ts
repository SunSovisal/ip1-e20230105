import CatalogPicker from '@/components/CatalogPicker.vue'
import type { CatalogNode } from '@/types/catalog'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const nodes: CatalogNode[] = [
  { id: 1, name: 'Student', parentId: null, active: true },
  { id: 2, name: 'Year 1', parentId: 1, active: true },
  { id: 3, name: 'Faculty', parentId: null, active: true },
  { id: 4, name: 'Old campus', parentId: null, active: false },
  { id: 5, name: 'Year 2', parentId: 1, active: true },
]

function setup(props: { modelValue: number[] | number | null; multiple?: boolean; leafOnly?: boolean }) {
  const wrapper = mount(CatalogPicker, {
    props: {
      nodes,
      ...props,
      'onUpdate:modelValue': (value: number[] | number | null) =>
        wrapper.setProps({ modelValue: value }),
    },
    attachTo: document.body,
  })
  return wrapper
}

type Wrapper = ReturnType<typeof setup>

const optionLabels = (wrapper: Wrapper) =>
  wrapper.findAll('[role="option"]').map((option) => option.text().replace('✓', '').trim())

describe('CatalogPicker, multiple (tags)', () => {
  it('lists active nodes in tree order and hides inactive ones', async () => {
    const wrapper = setup({ modelValue: [], multiple: true })
    await wrapper.find('input').trigger('focus')
    expect(optionLabels(wrapper)).toEqual(['Student', 'Year 1', 'Year 2', 'Faculty'])
    wrapper.unmount()
  })

  it('filters by full path while typing', async () => {
    const wrapper = setup({ modelValue: [], multiple: true })
    await wrapper.find('input').setValue('year 1')
    expect(optionLabels(wrapper)).toEqual(['Student / Year 1'])
    wrapper.unmount()
  })

  it('adds with the keyboard and removes the last pill with Backspace', async () => {
    const wrapper = setup({ modelValue: [], multiple: true })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toEqual([2])
    expect(wrapper.find('.chip').text()).toContain('Student / Year 1')

    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.props('modelValue')).toEqual([])
    wrapper.unmount()
  })

  it('removes a node with its × button', async () => {
    const wrapper = setup({ modelValue: [1, 3], multiple: true })
    await wrapper.find('button[aria-label="Remove Student"]').trigger('click')
    expect(wrapper.props('modelValue')).toEqual([3])
    wrapper.unmount()
  })
})

describe('CatalogPicker, single leaf-only (category)', () => {
  it('shows parents as headings that cannot be picked', async () => {
    const wrapper = setup({ modelValue: null, leafOnly: true })
    await wrapper.find('input').trigger('focus')
    expect(wrapper.findAll('.heading').map((heading) => heading.text())).toEqual(['Student'])
    expect(optionLabels(wrapper)).toEqual(['Year 1', 'Year 2', 'Faculty'])
    wrapper.unmount()
  })

  it('picks one id with the keyboard, skips headings, and closes', async () => {
    const wrapper = setup({ modelValue: null, leafOnly: true })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.props('modelValue')).toBe(5)
    expect(wrapper.find('[role="listbox"]').isVisible()).toBe(false)
    expect(input.attributes('placeholder')).toBe('Student / Year 2')
    wrapper.unmount()
  })

  it('keeps the value on Backspace', async () => {
    const wrapper = setup({ modelValue: 2, leafOnly: true })
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(wrapper.props('modelValue')).toBe(2)
    wrapper.unmount()
  })
})
