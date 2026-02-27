/** Data models for Agent Skills. */

export interface SkillProperties {
  /** Skill name in kebab-case (required) */
  name: string
  /** What the skill does and when the model should use it (required) */
  description: string
  /** License for the skill (optional) */
  license?: string
  /** Compatibility information (optional) */
  compatibility?: string
  /** Tool patterns the skill requires (optional, experimental) */
  allowedTools?: string
  /** Key-value pairs for client-specific properties */
  metadata?: Record<string, string>
}

export function toDict(props: SkillProperties): Record<string, unknown> {
  const result: Record<string, unknown> = {
    name: props.name,
    description: props.description,
  }
  if (props.license !== undefined)
    result.license = props.license
  if (props.compatibility !== undefined)
    result.compatibility = props.compatibility
  if (props.allowedTools !== undefined)
    result['allowed-tools'] = props.allowedTools
  if (props.metadata !== undefined && Object.keys(props.metadata).length > 0) {
    result.metadata = props.metadata
  }
  return result
}
