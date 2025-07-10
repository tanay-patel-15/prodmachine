import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Template, TemplateApplicationOptions } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../utils/constants';

interface TemplateModalProps {
  visible: boolean;
  templates: Template[];
  onClose: () => void;
  onApplyTemplate: (templateId: string, options: TemplateApplicationOptions) => void;
  selectedDayId?: string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  visible,
  templates,
  onClose,
  onApplyTemplate,
  selectedDayId,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [options, setOptions] = useState<TemplateApplicationOptions>({
    replaceExisting: false,
    mergeWithExisting: false,
  });

  const handleApplyTemplate = () => {
    if (selectedTemplate && selectedDayId) {
      onApplyTemplate(selectedTemplate.id, options);
      setSelectedTemplate(null);
      setOptions({ replaceExisting: false, mergeWithExisting: false });
      onClose();
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const renderTemplateItem = (template: Template) => (
    <TouchableOpacity
      key={template.id}
      style={[
        styles.templateItem,
        selectedTemplate?.id === template.id && styles.selectedTemplate
      ]}
      onPress={() => handleTemplateSelect(template)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateIcon}>{template.icon}</Text>
        <Text style={styles.templateName}>{template.name}</Text>
      </View>
      <Text style={styles.templateTasks}>
        {template.tasks.length} tasks
      </Text>
    </TouchableOpacity>
  );

  const renderOptions = () => (
    <View style={styles.optionsContainer}>
      <Text style={styles.optionsTitle}>Application Options:</Text>
      
      <TouchableOpacity
        style={[
          styles.optionItem,
          options.replaceExisting && styles.selectedOption
        ]}
        onPress={() => setOptions({
          replaceExisting: !options.replaceExisting,
          mergeWithExisting: false
        })}
      >
        <View style={[styles.radioButton, options.replaceExisting && styles.radioButtonSelected]}>
          {options.replaceExisting && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Replace existing tasks</Text>
          <Text style={styles.optionDescription}>
            Remove all current tasks and apply template
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionItem,
          options.mergeWithExisting && styles.selectedOption
        ]}
        onPress={() => setOptions({
          replaceExisting: false,
          mergeWithExisting: !options.mergeWithExisting
        })}
      >
        <View style={[styles.radioButton, options.mergeWithExisting && styles.radioButtonSelected]}>
          {options.mergeWithExisting && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Merge with existing tasks</Text>
          <Text style={styles.optionDescription}>
            Add template tasks to current tasks
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Template</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.templatesSection}>
            <Text style={styles.sectionTitle}>Available Templates</Text>
            {templates.map(renderTemplateItem)}
          </View>

          {selectedTemplate && renderOptions()}
        </ScrollView>

        {selectedTemplate && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.applyButton,
                (!options.replaceExisting && !options.mergeWithExisting) && styles.applyButtonDisabled
              ]}
              onPress={handleApplyTemplate}
              disabled={!options.replaceExisting && !options.mergeWithExisting}
            >
              <Text style={styles.applyButtonText}>
                Apply {selectedTemplate.name} Template
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  templatesSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  templateItem: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  selectedTemplate: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  templateIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  templateTasks: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  optionsContainer: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '10',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  footer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.medium,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  applyButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TemplateModal; 