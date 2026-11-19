package com.notokens.monolog.ime.shortcuts

import android.content.Context
import android.content.Intent
import android.provider.AlarmClock
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.notokens.monolog.MainActivity
import com.notokens.monolog.R
import com.notokens.monolog.ui.theme.PaperAccentBlue
import com.notokens.monolog.ui.theme.PaperAccentLavender
import com.notokens.monolog.ui.theme.PaperAccentLavenderBorder
import com.notokens.monolog.ui.theme.PaperCardBackground
import com.notokens.monolog.ui.theme.PaperCardBorder
import com.notokens.monolog.ui.theme.PaperCardSubtle
import com.notokens.monolog.ui.theme.PaperKeySubText
import com.notokens.monolog.ui.theme.PaperKeyText

enum class ShortcutView {
    MAIN_MENU,
    REMINDER_FORM
}

@Composable
fun QuickShortcutsPanel(
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var currentView by remember { mutableStateOf(ShortcutView.MAIN_MENU) }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 10.dp, vertical = 6.dp)
            .shadow(6.dp, RoundedCornerShape(18.dp))
            .clip(RoundedCornerShape(18.dp))
            .background(PaperCardBackground)
            .border(1.dp, PaperCardBorder, RoundedCornerShape(18.dp))
            .padding(14.dp)
    ) {
        when (currentView) {
            ShortcutView.MAIN_MENU -> {
                MainMenuView(
                    onClose = onClose,
                    onOpenReminder = { currentView = ShortcutView.REMINDER_FORM },
                    onOpenAlarm = { launchAlarmApp(context); onClose() },
                    onOpenJournal = { launchJournalApp(context); onClose() }
                )
            }
            ShortcutView.REMINDER_FORM -> {
                InlineReminderView(
                    onBack = { currentView = ShortcutView.MAIN_MENU },
                    onSaved = { onClose() }
                )
            }
        }
    }
}

@Composable
private fun MainMenuView(
    onClose: () -> Unit,
    onOpenReminder: () -> Unit,
    onOpenAlarm: () -> Unit,
    onOpenJournal: () -> Unit
) {
    Column {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Quick shortcuts",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = PaperKeyText
            )

            Text(
                text = "✕",
                fontSize = 14.sp,
                color = PaperKeySubText,
                modifier = Modifier
                    .clip(CircleShape)
                    .clickable { onClose() }
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 3 Cards: Reminder, Alarm, Journal
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // 1. Reminder
            ShortcutCard(
                modifier = Modifier.weight(1f),
                iconContent = { Text(text = "🔔", fontSize = 20.sp) },
                title = "Reminder",
                subtitle = "Set reminder",
                containerColor = PaperCardSubtle,
                onClick = onOpenReminder
            )

            // 2. Alarm
            ShortcutCard(
                modifier = Modifier.weight(1f),
                iconContent = { Text(text = "⏰", fontSize = 20.sp) },
                title = "Alarm",
                subtitle = "System clock",
                containerColor = PaperCardSubtle,
                onClick = onOpenAlarm
            )

            // 3. Journal (Open Monolog)
            ShortcutCard(
                modifier = Modifier.weight(1f),
                iconContent = {
                    Image(
                        painter = painterResource(id = R.drawable.ic_monolog_m),
                        contentDescription = "Journal icon",
                        modifier = Modifier.size(24.dp)
                    )
                },
                title = "Journal",
                subtitle = "Open Monolog",
                containerColor = PaperAccentLavender,
                onClick = onOpenJournal
            )
        }
    }
}

@Composable
private fun ShortcutCard(
    modifier: Modifier = Modifier,
    iconContent: @Composable () -> Unit,
    title: String,
    subtitle: String,
    containerColor: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(containerColor)
            .border(1.dp, PaperCardBorder, RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(horizontal = 8.dp, vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier.size(28.dp),
            contentAlignment = Alignment.Center
        ) {
            iconContent()
        }

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = title,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = PaperKeyText
        )

        Text(
            text = subtitle,
            fontSize = 10.sp,
            color = PaperKeySubText,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun InlineReminderView(
    onBack: () -> Unit,
    onSaved: () -> Unit
) {
    val context = LocalContext.current
    var reminderTitle by remember { mutableStateOf("") }
    var selectedTime by remember { mutableStateOf("Today 5:00 PM") }

    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "←",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = PaperKeyText,
                modifier = Modifier
                    .clip(CircleShape)
                    .clickable { onBack() }
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Set Private Reminder",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = PaperKeyText
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = reminderTitle,
            onValueChange = { reminderTitle = it },
            placeholder = { Text("e.g. Bring exam notes...", fontSize = 12.sp, color = PaperKeySubText) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = PaperKeyText,
                unfocusedTextColor = PaperKeyText,
                focusedBorderColor = PaperAccentBlue,
                unfocusedBorderColor = PaperCardBorder
            )
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Time chips
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf("Today 5 PM", "Tomorrow 9 AM", "In 1 Hour").forEach { chip ->
                val isSelected = selectedTime == chip
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) PaperAccentBlue else PaperCardSubtle)
                        .clickable { selectedTime = chip }
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = chip,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) Color.White else PaperKeyText
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Button(
                onClick = {
                    val finalTitle = reminderTitle.ifBlank { "Reminder ($selectedTime)" }
                    Toast.makeText(context, "Saved: \"$finalTitle\" for $selectedTime", Toast.LENGTH_SHORT).show()
                    onSaved()
                },
                colors = ButtonDefaults.buttonColors(containerColor = PaperAccentBlue),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.height(34.dp)
            ) {
                Text(text = "Save Reminder", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

private fun launchJournalApp(context: Context) {
    try {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
        }
        context.startActivity(intent)
    } catch (_: Exception) {}
}

private fun launchAlarmApp(context: Context) {
    try {
        val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        context.startActivity(intent)
    } catch (_: Exception) {
        try {
            val showIntent = Intent(AlarmClock.ACTION_SHOW_ALARMS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(showIntent)
        } catch (_: Exception) {
            Toast.makeText(context, "Could not open system Clock app", Toast.LENGTH_SHORT).show()
        }
    }
}
