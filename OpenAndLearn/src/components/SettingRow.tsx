import React from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type SettingRowProps =
    | {
        type: 'toggle';
        label: string;
        description?: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }
    | {
        type: 'select';
        label: string;
        description?: string;
        value: string;
        options: { label: string; value: string }[];
        onSelect: (value: string) => void;
    }
    | {
        type: 'action';
        label: string;
        description?: string;
        actionLabel?: string;
        onPress: () => void;
    };

export function SettingRow(props: SettingRowProps) {
    return (
        <View style={styles.row}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{props.label}</Text>
                {props.description && (
                    <Text style={styles.description}>{props.description}</Text>
                )}
            </View>

            {props.type === 'toggle' && (
                <Switch
                    value={props.value}
                    onValueChange={props.onValueChange}
                    trackColor={{ false: '#E0E0E0', true: '#6C5CE7' }}
                    thumbColor="#FFFFFF"
                />
            )}

            {props.type === 'select' && (
                <View style={styles.selectContainer}>
                    {props.options.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.selectOption,
                                props.value === option.value && styles.selectOptionActive,
                            ]}
                            onPress={() => props.onSelect(option.value)}
                        >
                            <Text
                                style={[
                                    styles.selectOptionText,
                                    props.value === option.value &&
                                    styles.selectOptionTextActive,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {props.type === 'action' && (
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={props.onPress}
                >
                    <Text style={styles.actionButtonText}>
                        {props.actionLabel || '設定'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5EA',
    },
    labelContainer: {
        flex: 1,
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    description: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    selectContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    selectOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F2F2F7',
    },
    selectOptionActive: {
        backgroundColor: '#6C5CE7',
    },
    selectOptionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
    },
    selectOptionTextActive: {
        color: '#FFFFFF',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#6C5CE7',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
