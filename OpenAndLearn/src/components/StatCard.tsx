import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    icon?: string;
};

export function StatCard({ title, value, subtitle, color = '#6C5CE7', icon }: StatCardProps) {
    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <View style={styles.header}>
                {icon && <Text style={styles.icon}>{icon}</Text>}
                <Text style={styles.title}>{title}</Text>
            </View>
            <Text style={[styles.value, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        fontSize: 16,
        marginRight: 6,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: '#AEAEB2',
        marginTop: 4,
    },
});
