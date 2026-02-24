import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

type ChoiceButtonProps = {
    label: string;
    index: number;
    onPress: (index: number) => void;
    disabled?: boolean;
    state?: 'default' | 'correct' | 'wrong' | 'dimmed';
};

const PREFIX_LABELS = ['A', 'B', 'C', 'D'];

export function ChoiceButton({
    label,
    index,
    onPress,
    disabled = false,
    state = 'default',
}: ChoiceButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const bgAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (state === 'correct' || state === 'wrong') {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [state, scaleAnim]);

    const getBackgroundColor = () => {
        switch (state) {
            case 'correct':
                return '#E8F5E9';
            case 'wrong':
                return '#FFEBEE';
            case 'dimmed':
                return '#F5F5F5';
            default:
                return '#FFFFFF';
        }
    };

    const getBorderColor = () => {
        switch (state) {
            case 'correct':
                return '#4CAF50';
            case 'wrong':
                return '#F44336';
            case 'dimmed':
                return '#E0E0E0';
            default:
                return '#E8E8ED';
        }
    };

    const getTextColor = () => {
        switch (state) {
            case 'correct':
                return '#2E7D32';
            case 'wrong':
                return '#C62828';
            case 'dimmed':
                return '#BDBDBD';
            default:
                return '#1C1C1E';
        }
    };

    const getPrefixColor = () => {
        switch (state) {
            case 'correct':
                return '#4CAF50';
            case 'wrong':
                return '#F44336';
            case 'dimmed':
                return '#BDBDBD';
            default:
                return '#6C5CE7';
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                    },
                ]}
                onPress={() => onPress(index)}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Text style={[styles.prefix, { color: getPrefixColor() }]}>
                    {PREFIX_LABELS[index]}
                </Text>
                <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
                {state === 'correct' && <Text style={styles.resultIcon}>✓</Text>}
                {state === 'wrong' && <Text style={styles.resultIcon}>✗</Text>}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 1.5,
        marginBottom: 10,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '800',
        marginRight: 14,
        width: 24,
    },
    label: {
        fontSize: 17,
        fontWeight: '500',
        flex: 1,
    },
    resultIcon: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
});
